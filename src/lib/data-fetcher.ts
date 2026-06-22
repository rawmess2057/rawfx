import { Candle } from './types'
import { findSymbol } from '@/constants/symbols'

interface YFChartQuote {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface YFChartResult {
  meta: Record<string, unknown>
  quotes: YFChartQuote[]
}

interface YFInstance {
  chart(ticker: string, options: { interval: string; period1: string }): Promise<YFChartResult>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yfCache: any = null

async function getYF(): Promise<YFInstance> {
  if (!yfCache) {
    const YahooFinance = (await import('yahoo-finance2')).default
    yfCache = new YahooFinance()
  }
  return yfCache as YFInstance
}

function parseInterval(timeframe: '15m' | '1h' | '1d'): { interval: string; period1: string } {
  const now = Date.now()
  switch (timeframe) {
    case '15m': return { interval: '15m', period1: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    case '1h': return { interval: '60m', period1: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    case '1d': return { interval: '1d', period1: new Date(now - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  }
}

export async function fetchOHLCV(symbol: string, timeframe: '15m' | '1h' | '1d'): Promise<Candle[]> {
  const def = findSymbol(symbol)
  const ticker = def?.yahooTicker || symbol
  const { interval, period1 } = parseInterval(timeframe)

  try {
    const yf = await getYF()
    const data = await yf.chart(ticker, { interval, period1 })
    const quotes = data.quotes

    const candles: Candle[] = []
    for (const q of quotes) {
      if (q.open == null || q.high == null || q.low == null || q.close == null) continue
      candles.push({
        timestamp: q.date.getTime(),
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume,
      })
    }

    return candles
  } catch (err) {
    console.error(`[data-fetcher] Error fetching ${ticker} (${timeframe}):`, err)
    return []
  }
}

export async function fetchSparkline(symbol: string): Promise<number[]> {
  const def = findSymbol(symbol)
  const ticker = def?.yahooTicker || symbol

  try {
    const yf = await getYF()
    const today = new Date().toISOString().split('T')[0]
    const data = await yf.chart(ticker, { interval: '5m', period1: today })
    const closes = data.quotes.map(q => q.close).filter((c): c is number => c != null)
    return closes.slice(-40)
  } catch {
    return []
  }
}
