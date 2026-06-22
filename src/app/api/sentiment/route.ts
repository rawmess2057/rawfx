import { NextRequest, NextResponse } from 'next/server'
import { fetchOHLCV, fetchSparkline } from '@/lib/data-fetcher'
import { computePeriodData, mergeTimeframes } from '@/lib/sentiment'
import { aggregateCandles } from '@/lib/candle-utils'
import { findSymbol } from '@/constants/symbols'
import { PeriodSentiment, SentimentResult } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let symbols: string[] = body.symbols

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
    }

    symbols = [...new Set(symbols)]

    const results: SentimentResult[] = []

    // Process in parallel batches to avoid rate limits
    const batchSize = 5
    const batchDelay = 500
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map(async (symbol) => {
          const def = findSymbol(symbol)
          const displaySymbol = def?.display || symbol

          const processSymbol = async () => {
            const [candles15m, candles1h, candles1d, sparkline] = await Promise.all([
              fetchOHLCV(symbol, '15m'),
              fetchOHLCV(symbol, '1h'),
              fetchOHLCV(symbol, '1d'),
              fetchSparkline(symbol),
            ])

            if (candles15m.length < 20 && candles1h.length < 20 && candles1d.length < 10) {
              throw new Error(`Insufficient data for ${displaySymbol}`)
            }

            const candles5d = aggregateCandles(candles1d, 5)

            const intraday15m = candles15m.length >= 20 ? computePeriodData(candles15m, 'intraday') : null
            const intraday1h = candles1h.length >= 20 ? computePeriodData(candles1h, 'intraday') : null
            const daily = computePeriodData(candles1d, 'daily')
            const threeDay = candles5d.length >= 10 ? computePeriodData(candles5d, 'context') : daily

            let intraday: PeriodSentiment
            if (intraday15m && intraday1h) {
              const mergedTrend: 'bullish' | 'bearish' | 'neutral' =
                intraday15m.bullPct > 55 || intraday1h.bullPct > 55
                  ? 'bullish'
                  : intraday15m.bearPct > 55 || intraday1h.bearPct > 55
                    ? 'bearish'
                    : 'neutral'
              intraday = {
                ...intraday1h,
                bullPct: Math.round(intraday15m.bullPct * 0.6 + intraday1h.bullPct * 0.4),
                bearPct: Math.round(intraday15m.bearPct * 0.6 + intraday1h.bearPct * 0.4),
                momentumScore: Math.round(intraday15m.momentumScore * 0.6 + intraday1h.momentumScore * 0.4),
                adx: Math.round(intraday15m.adx * 0.6 + intraday1h.adx * 0.4),
                trend: mergedTrend,
              }
            } else {
              intraday = intraday15m || intraday1h || daily
            }

            const { overallTrend, overallConviction } = mergeTimeframes(intraday, daily, threeDay)

            const price = daily.lastPrice || intraday.lastPrice

            return {
              symbol: displaySymbol,
              intraday,
              daily,
              threeDay,
              overallTrend,
              overallConviction,
              price,
              change24h: daily.change24h || intraday.change24h || 0,
              sparklineData: sparkline,
              lastUpdated: Date.now(),
            } satisfies SentimentResult
          }

          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout processing ${displaySymbol}`)), 12000)
          )
          return Promise.race([processSymbol(), timeout])
        })
      )

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        }
      }

      if (i + batchSize < symbols.length) {
        await new Promise(r => setTimeout(r, batchDelay))
      }
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[sentiment API] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
