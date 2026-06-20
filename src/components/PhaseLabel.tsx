'use client'

import { PhaseResult } from '@/lib/types'

interface Props {
  phase: PhaseResult
  size?: 'sm' | 'md'
}

const colors: Record<string, string> = {
  Accumulation: 'text-[#3b82f6] bg-blue-500/10',
  Reaccumulation: 'text-[#a855f7] bg-purple-500/10',
  Markup: 'text-[#14f5c7] bg-emerald-500/10',
  Distribution: 'text-[#f43f5e] bg-rose-500/10',
  Markdown: 'text-[#f43f5e] bg-rose-500/10',
  Neutral: 'text-[#94a3b8] bg-white/5',
}

export default function PhaseLabel({ phase, size = 'sm' }: Props) {
  const color = colors[phase.phase] || colors.Neutral
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold ${textSize} ${color}`}
      title={phase.description}
    >
      {phase.phase}
    </span>
  )
}
