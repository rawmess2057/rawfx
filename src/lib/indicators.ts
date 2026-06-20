import { Candle, SwingPoint } from './types'

// ── EMA ──

export function computeEMA(values: number[], period: number): number[] {
  const result: number[] = []
  const multiplier = 2 / (period + 1)
  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period
  result.push(ema)
  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema
    result.push(ema)
  }
  return result
}

export function getEMAs(candles: Candle[]): { ema5: number[]; ema9: number[]; ema21: number[] } {
  const closes = candles.map(c => c.close)
  return {
    ema5: computeEMA(closes, 5),
    ema9: computeEMA(closes, 9),
    ema21: computeEMA(closes, 21),
  }
}

export function computeEmaStatus(candles: Candle[]): { status: 'bullish' | 'bearish' | 'mixed'; score: number } {
  if (candles.length < 21) return { status: 'mixed', score: 50 }
  const closes = candles.map(c => c.close)
  const { ema5, ema9, ema21 } = getEMAs(candles)
  const lastIdx = closes.length - 1
  const price = closes[lastIdx]
  const e5 = ema5[ema5.length - 1]
  const e9 = ema9[ema9.length - 1]
  const e21 = ema21[ema21.length - 1]

  const priceAbove21 = price > e21 ? 1 : 0
  const e5Above9 = e5 > e9 ? 1 : 0
  const e9Above21 = e9 > e21 ? 1 : 0
  const allBull = priceAbove21 + e5Above9 + e9Above21

  if (allBull === 3) return { status: 'bullish', score: 85 }
  if (allBull === 2) return { status: 'bullish', score: 65 }
  if (allBull === 0) return { status: 'bearish', score: 15 }
  if (allBull === 1) return { status: 'bearish', score: 35 }
  return { status: 'mixed', score: 50 }
}

// ── CHOP INDEX ──

export function computeChopIndex(candles: Candle[], period: number = 14): number {
  if (candles.length < period) return 0.5
  const trueRanges: number[] = []
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high
    const low = candles[i].low
    const prevClose = candles[i - 1].close
    trueRanges.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)))
  }
  if (trueRanges.length < period) return 0.5
  const atrSum = trueRanges.slice(-period).reduce((a, b) => a + b, 0)
  const atr = atrSum / period
  const recent = candles.slice(-period)
  const highMax = Math.max(...recent.map(c => c.high))
  const lowMin = Math.min(...recent.map(c => c.low))
  const range = highMax - lowMin
  if (range === 0) return 1
  const sumBody = recent.reduce((s, c) => s + Math.abs(c.close - c.open), 0)
  const avgBody = sumBody / period
  const churn = atr > 0 ? avgBody / atr : 0.5
  const rangeRatio = range > 0 ? atr / range : 0.5
  const chop = churn * 0.5 + rangeRatio * 0.5
  return Math.min(1, Math.max(0, chop))
}

// ── ATR ──

export function computeATR(candles: Candle[], period: number = 14): number {
  if (candles.length < period + 1) return 0
  const ranges: number[] = []
  for (let i = candles.length - period; i < candles.length; i++) {
    const high = candles[i].high
    const low = candles[i].low
    const prevClose = candles[i - 1].close
    ranges.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)))
  }
  return ranges.reduce((a, b) => a + b, 0) / period
}

// ── 24H CHANGE ──

export function computeChange24h(candles: Candle[]): number {
  if (candles.length < 2) return 0
  const latest = candles[candles.length - 1].close
  const prev = candles[candles.length - 2].close
  return ((latest - prev) / prev) * 100
}

// ── RSI ──

export function computeRSI(candles: Candle[], period: number = 14): number[] {
  const closes = candles.map(c => c.close)
  if (closes.length < period + 1) return closes.map(() => 50)
  const rsis: number[] = new Array(period).fill(50)

  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1]
    avgGain += Math.max(diff, 0) / period
    avgLoss += Math.max(-diff, 0) / period
  }
  rsis.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss))

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    const gain = Math.max(diff, 0)
    const loss = Math.max(-diff, 0)
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    rsis.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss))
  }
  return rsis
}

// ── RSI DIVERGENCE DETECTION ──

export interface DivergenceSignal {
  type: 'regular_bullish' | 'regular_bearish' | 'hidden_bullish' | 'hidden_bearish'
  strength: 'strong' | 'moderate'
}

export function detectDivergence(candles: Candle[], swings: SwingPoint[], rsiValues: number[]): DivergenceSignal[] {
  const signals: DivergenceSignal[] = []
  if (swings.length < 4 || rsiValues.length < 5) return signals

  const recentSwings = swings.slice(-6)
  const priceHighs = recentSwings.filter(s => s.type === 'high').map(s => ({ price: s.price, index: s.index }))
  const priceLows = recentSwings.filter(s => s.type === 'low').map(s => ({ price: s.price, index: s.index }))

  // Hidden bullish divergence: higher low in price, lower low in RSI
  if (priceLows.length >= 2) {
    const pLow2 = priceLows[priceLows.length - 2]
    const pLow1 = priceLows[priceLows.length - 1]
    if (pLow1.price > pLow2.price) {
      const rsi2 = rsiValues[Math.min(pLow2.index, rsiValues.length - 1)]
      const rsi1 = rsiValues[Math.min(pLow1.index, rsiValues.length - 1)]
      if (rsi1 < rsi2) {
        signals.push({ type: 'hidden_bullish', strength: rsi2 - rsi1 > 10 ? 'strong' : 'moderate' })
      }
    }
  }

  // Hidden bearish divergence: lower high in price, higher high in RSI
  if (priceHighs.length >= 2) {
    const pHigh2 = priceHighs[priceHighs.length - 2]
    const pHigh1 = priceHighs[priceHighs.length - 1]
    if (pHigh1.price < pHigh2.price) {
      const rsi2 = rsiValues[Math.min(pHigh2.index, rsiValues.length - 1)]
      const rsi1 = rsiValues[Math.min(pHigh1.index, rsiValues.length - 1)]
      if (rsi1 > rsi2) {
        signals.push({ type: 'hidden_bearish', strength: rsi1 - rsi2 > 10 ? 'strong' : 'moderate' })
      }
    }
  }

  // Regular bullish divergence: lower low in price, higher low in RSI
  if (priceLows.length >= 2) {
    const pLow2 = priceLows[priceLows.length - 2]
    const pLow1 = priceLows[priceLows.length - 1]
    if (pLow1.price < pLow2.price) {
      const rsi2 = rsiValues[Math.min(pLow2.index, rsiValues.length - 1)]
      const rsi1 = rsiValues[Math.min(pLow1.index, rsiValues.length - 1)]
      if (rsi1 > rsi2) {
        signals.push({ type: 'regular_bullish', strength: rsi1 - rsi2 > 10 ? 'strong' : 'moderate' })
      }
    }
  }

  // Regular bearish divergence: higher high in price, lower high in RSI
  if (priceHighs.length >= 2) {
    const pHigh2 = priceHighs[priceHighs.length - 2]
    const pHigh1 = priceHighs[priceHighs.length - 1]
    if (pHigh1.price > pHigh2.price) {
      const rsi2 = rsiValues[Math.min(pHigh2.index, rsiValues.length - 1)]
      const rsi1 = rsiValues[Math.min(pHigh1.index, rsiValues.length - 1)]
      if (rsi1 < rsi2) {
        signals.push({ type: 'regular_bearish', strength: rsi2 - rsi1 > 10 ? 'strong' : 'moderate' })
      }
    }
  }

  return signals
}

// ── ADX ──

export function computeADX(candles: Candle[], period: number = 14): { adx: number; plusDI: number; minusDI: number } {
  if (candles.length < period + 2) return { adx: 20, plusDI: 50, minusDI: 50 }

  const tr: number[] = []
  const plusDM: number[] = []
  const minusDM: number[] = []

  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high
    const low = candles[i].low
    const prevHigh = candles[i - 1].high
    const prevLow = candles[i - 1].low
    const prevClose = candles[i - 1].close

    tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)))

    const upMove = high - prevHigh
    const downMove = prevLow - low
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0)
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0)
  }

  const smooth = (values: number[], period: number): number[] => {
    const result: number[] = []
    let sum = values.slice(0, period).reduce((a, b) => a + b, 0)
    result.push(sum)
    for (let i = period; i < values.length; i++) {
      sum = sum - sum / period + values[i]
      result.push(sum)
    }
    return result
  }

  const smoothedTR = smooth(tr, period)
  const smoothedPlus = smooth(plusDM, period)
  const smoothedMinus = smooth(minusDM, period)

  const dx: number[] = []
  for (let i = 0; i < smoothedTR.length; i++) {
    const pDI = smoothedTR[i] > 0 ? (smoothedPlus[i] / smoothedTR[i]) * 100 : 0
    const mDI = smoothedTR[i] > 0 ? (smoothedMinus[i] / smoothedTR[i]) * 100 : 0
    const diDiff = Math.abs(pDI - mDI)
    const diSum = pDI + mDI
    dx.push(diSum > 0 ? (diDiff / diSum) * 100 : 0)
  }

  // ADX is smoothed DX using Wilder's method (average, not cumulative)
  if (dx.length < period) return { adx: 20, plusDI: 50, minusDI: 50 }
  let adx = dx.slice(0, period).reduce((a, b) => a + b, 0) / period
  for (let i = period; i < dx.length; i++) {
    adx = (adx * (period - 1) + dx[i]) / period
  }

  // +DI and -DI are directional values (0-100)
  const lastTR = smoothedTR[smoothedTR.length - 1]
  const plusDI = lastTR > 0 ? Math.round((smoothedPlus[smoothedPlus.length - 1] / lastTR) * 1000) / 10 : 50
  const minusDI = lastTR > 0 ? Math.round((smoothedMinus[smoothedMinus.length - 1] / lastTR) * 1000) / 10 : 50

  return { adx: Math.round(adx * 10) / 10, plusDI, minusDI }
}

// ── MOMENTUM SCORE ──
// Combines ROC, candle streaks, and EMA proximity into 0-100 score
export function computeMomentumScore(candles: Candle[]): number {
  if (candles.length < 10) return 50

  const closes = candles.map(c => c.close)
  const opens = candles.map(c => c.open)
  const last = closes.length - 1

  // Rate of Change
  const roc5 = ((closes[last] - closes[last - 5]) / closes[last - 5]) * 100
  const roc10 = ((closes[last] - closes[last - 10]) / closes[last - 10]) * 100

  // Consecutive candle direction
  let streakBull = 0
  let streakBear = 0
  for (let i = last; i > Math.max(0, last - 10); i--) {
    if (closes[i] > opens[i]) {
      streakBull++
      streakBear = 0
    } else {
      streakBear++
      streakBull = 0
    }
  }

  // Consecutive closes above EMA-9
  const { ema9 } = getEMAs(candles)
  let emaStreakBull = 0
  let emaStreakBear = 0
  for (let i = last; i > Math.max(0, last - 10); i--) {
    const emaIdx = Math.min(i, ema9.length - 1)
    if (closes[i] > ema9[emaIdx]) {
      emaStreakBull++
      emaStreakBear = 0
    } else {
      emaStreakBear++
      emaStreakBull = 0
    }
  }

  // Score components (each 0-100)
  const rocScore = Math.max(0, Math.min(100, 50 + roc5 * 5 + roc10 * 2.5))
  const streakScore = Math.max(0, Math.min(100,
    streakBull >= 5 ? 100 : streakBull >= 3 ? 80 : streakBull >= 2 ? 65 : streakBull >= 1 ? 55 :
    streakBear >= 5 ? 0 : streakBear >= 3 ? 20 : streakBear >= 2 ? 35 : streakBear >= 1 ? 45 : 50
  ))
  const emaStreakScore = Math.max(0, Math.min(100,
    emaStreakBull >= 5 ? 100 : emaStreakBull >= 3 ? 80 : emaStreakBull >= 2 ? 65 : emaStreakBull >= 1 ? 55 :
    emaStreakBear >= 5 ? 0 : emaStreakBear >= 3 ? 20 : emaStreakBear >= 2 ? 35 : emaStreakBear >= 1 ? 45 : 50
  ))

  return rocScore * 0.3 + streakScore * 0.35 + emaStreakScore * 0.35
}
