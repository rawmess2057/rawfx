'use client'

interface Props {
  conviction: 'high' | 'medium' | 'low'
}

const config = {
  high: {
    label: 'High Conviction',
    bg: 'bg-[#14f5c7]/10',
    text: 'text-[#14f5c7]',
    dot: 'bg-[#14f5c7]',
    glow: 'shadow-[0_0_8px_rgba(20,245,199,0.25)]',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#f59e0b]/10',
    text: 'text-[#f59e0b]',
    dot: 'bg-[#f59e0b]',
    glow: '',
  },
  low: {
    label: 'Low',
    bg: 'bg-white/5',
    text: 'text-[#94a3b8]',
    dot: 'bg-[#475569]',
    glow: '',
  },
}

export default function ConvictionBadge({ conviction }: Props) {
  const c = config[conviction]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text} ${c.glow}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
