import { Candle } from './types'

export function aggregateCandles(daily: Candle[], days: number): Candle[] {
  const result: Candle[] = []
  for (let i = 0; i + days <= daily.length; i += days) {
    const chunk = daily.slice(i, i + days)
    result.push({
      timestamp: chunk[chunk.length - 1].timestamp,
      open: chunk[0].open,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      close: chunk[chunk.length - 1].close,
    })
  }
  return result
}
