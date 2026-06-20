'use client'

import { motion } from 'framer-motion'

interface Props {
  bullPct: number
  bearPct: number
  size?: 'sm' | 'md' | 'lg'
}

export default function SentimentBar({ bullPct, bearPct, size = 'md' }: Props) {
  const height = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-3.5'
  const glow = bearPct > 70 ? 'glow-red' : bullPct > 70 ? 'glow-green' : ''

  return (
    <div className={`relative w-full ${height} rounded-full overflow-hidden bg-white/5 ${glow}`}>
      <div className="absolute inset-0 flex">
        <motion.div
          className="h-full bg-gradient-to-r from-[#f43f5e] to-[#f43f5e]/80"
          initial={{ width: 0 }}
          animate={{ width: `${bearPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full bg-gradient-to-l from-[#14f5c7] to-[#14f5c7]/80"
          initial={{ width: 0 }}
          animate={{ width: `${bullPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {size === 'lg' && (
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold text-[#f43f5e]">{bearPct}%</span>
          <span className="text-[10px] font-semibold text-[#14f5c7]">{bullPct}%</span>
        </div>
      )}
    </div>
  )
}
