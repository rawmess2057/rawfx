'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SentimentResult } from '@/lib/types'
import SentimentBar from './SentimentBar'
import PhaseLabel from './PhaseLabel'
import ConvictionBadge from './ConvictionBadge'
import GlassCard from './GlassCard'

interface Props {
  result: SentimentResult | null
  open: boolean
  onClose: () => void
  timeframe: 'intraday' | 'daily'
  onTimeframeChange: (t: 'intraday' | 'daily') => void
}

export default function DetailPanel({ result, open, onClose, timeframe, onTimeframeChange }: Props) {
  if (!result) return null

  const data = timeframe === 'intraday' ? result.intraday : result.daily
  const otherData = timeframe === 'intraday' ? result.daily : result.intraday

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full shrink-0 overflow-hidden border-l border-white/5"
        >
          <div className="absolute inset-0 glass overflow-y-auto">
            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#f1f5f9]">{result.symbol}</h2>
                  <div className="text-sm text-[#94a3b8]">
                    ${result.price.toFixed(2)}
                    <span className={`ml-1.5 font-semibold ${result.change24h >= 0 ? 'text-[#14f5c7]' : 'text-[#f43f5e]'}`}>
                      {result.change24h >= 0 ? '+' : ''}{result.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#475569] hover:text-[#f1f5f9] transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Timeframe toggle */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => onTimeframeChange('intraday')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === 'intraday'
                      ? 'bg-[#14f5c7]/10 text-[#14f5c7]'
                      : 'text-[#475569] hover:text-[#94a3b8]'
                  }`}
                >
                  Intraday
                </button>
                <button
                  onClick={() => onTimeframeChange('daily')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeframe === 'daily'
                      ? 'bg-[#a855f7]/10 text-[#a855f7]'
                      : 'text-[#475569] hover:text-[#94a3b8]'
                  }`}
                >
                  Daily
                </button>
              </div>

              {/* Sentiment Bars */}
              <GlassCard className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Sentiment</span>
                  <ConvictionBadge conviction={data.conviction} />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#f43f5e] font-semibold">Bearish {data.bearPct}%</span>
                      <span className="text-[#14f5c7] font-semibold">Bullish {data.bullPct}%</span>
                    </div>
                    <SentimentBar bullPct={data.bullPct} bearPct={data.bearPct} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    data.trend === 'bullish' ? 'text-[#14f5c7]' :
                    data.trend === 'bearish' ? 'text-[#f43f5e]' : 'text-[#94a3b8]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      data.trend === 'bullish' ? 'bg-[#14f5c7]' :
                      data.trend === 'bearish' ? 'bg-[#f43f5e]' : 'bg-[#475569]'
                    }`} />
                    {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
                  </span>
                  <PhaseLabel phase={data.phase} size="sm" />
                </div>
              </GlassCard>

              {/* Score Breakdown */}
              <GlassCard className="p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-[#475569] mb-0.5">Structure</div>
                    <div className="text-sm font-bold text-[#f1f5f9]">{data.structureScore.toFixed(0)}</div>
                    <div className="text-[10px] text-[#475569]">50% weight</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#475569] mb-0.5">Momentum</div>
                    <div className="text-sm font-bold text-[#f1f5f9]">{data.momentumScore.toFixed(0)}</div>
                    <div className="text-[10px] text-[#475569]">30% weight</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#475569] mb-0.5">EMA Alignment</div>
                    <div className="text-sm font-bold text-[#f1f5f9]">{data.emaScore.toFixed(0)}</div>
                    <div className="text-[10px] text-[#475569]">20% weight</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="text-[11px] text-[#475569]">EMA Status:</div>
                  <span className={`text-xs font-semibold ${
                    data.emaStatus === 'bullish' ? 'text-[#14f5c7]' :
                    data.emaStatus === 'bearish' ? 'text-[#f43f5e]' : 'text-[#94a3b8]'
                  }`}>
                    {data.emaStatus.charAt(0).toUpperCase() + data.emaStatus.slice(1)}
                  </span>
                </div>
              </GlassCard>

              {/* Chop & Phase Detail */}
              <GlassCard className="p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Market Conditions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#94a3b8]">ADX</span>
                    <span className={`text-xs font-semibold ${data.adx > 25 ? 'text-[#14f5c7]' : data.adx > 20 ? 'text-[#f59e0b]' : 'text-[#475569]'}`}>
                      {data.adx.toFixed(1)}
                      <span className="text-[10px] text-[#475569] ml-1">
                        {data.adx > 30 ? '(Strong)' : data.adx > 25 ? '(Trending)' : data.adx > 20 ? '(Weak)' : '(Ranging)'}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#94a3b8]">Chop Index</span>
                    <span className={`text-xs font-semibold ${
                      data.chop > 0.6 ? 'text-[#f59e0b]' :
                      data.chop > 0.4 ? 'text-[#94a3b8]' : 'text-[#14f5c7]'
                    }`}>
                      {data.chop.toFixed(2)}
                      <span className="text-[10px] text-[#475569] ml-1">
                        {data.chop > 0.6 ? '(Choppy)' : data.chop > 0.4 ? '(Mild)' : '(Trending)'}
                      </span>
                    </span>
                  </div>
                  <div className="pt-1">
                    <div className="text-xs text-[#475569] mb-1">Phase Analysis</div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">{data.phase.description}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Structure Events */}
              <GlassCard className="p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Structure Events</h3>
                {data.bosEvents.length === 0 && data.chochEvents.length === 0 ? (
                  <p className="text-xs text-[#475569]">No significant structure events detected</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[...data.bosEvents, ...data.chochEvents]
                      .sort((a, b) => b.index - a.index)
                      .slice(0, 6)
                      .map((evt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full ${
                            evt.direction === 'bullish' ? 'bg-[#14f5c7]' : 'bg-[#f43f5e]'
                          }`} />
                          <div>
                            <span className={`font-semibold ${
                              evt.type === 'bos' ? 'text-[#14f5c7]' : 'text-[#a855f7]'
                            }`}>
                              {evt.type.toUpperCase()}
                            </span>
                            <span className="text-[#94a3b8]"> — {evt.description}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </GlassCard>

              {/* Swing Points */}
              <GlassCard className="p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Swing Points</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-[#14f5c7] font-semibold mb-1">Swing Highs</div>
                    {data.swingHighs.length === 0 ? (
                      <div className="text-xs text-[#475569]">None</div>
                    ) : (
                      data.swingHighs.slice(-5).reverse().map((s, i) => (
                        <div key={i} className="text-xs text-[#94a3b8]">
                          ${s.price.toFixed(2)}
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] text-[#f43f5e] font-semibold mb-1">Swing Lows</div>
                    {data.swingLows.length === 0 ? (
                      <div className="text-xs text-[#475569]">None</div>
                    ) : (
                      data.swingLows.slice(-5).reverse().map((s, i) => (
                        <div key={i} className="text-xs text-[#94a3b8]">
                          ${s.price.toFixed(2)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Other timeframe quick view */}
              <GlassCard className="p-4 space-y-2">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  {timeframe === 'intraday' ? 'Daily' : 'Intraday'} View
                </h3>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Bearish</span>
                  <span className="text-[#f43f5e] font-semibold">{otherData.bearPct}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Bullish</span>
                  <span className="text-[#14f5c7] font-semibold">{otherData.bullPct}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Phase</span>
                  <PhaseLabel phase={otherData.phase} size="sm" />
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
