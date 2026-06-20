'use client'

interface Props {
  active: 'intraday' | 'daily'
  onChange: (tab: 'intraday' | 'daily') => void
}

export default function TimeframeTabs({ active, onChange }: Props) {
  return (
    <div className="glass rounded-lg inline-flex p-0.5 gap-0.5">
      <button
        onClick={() => onChange('intraday')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          active === 'intraday'
            ? 'bg-[#14f5c7]/10 text-[#14f5c7] shadow-[0_0_8px_rgba(20,245,199,0.15)]'
            : 'text-[#475569] hover:text-[#94a3b8]'
        }`}
      >
        Intraday
      </button>
      <button
        onClick={() => onChange('daily')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          active === 'daily'
            ? 'bg-[#a855f7]/10 text-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.15)]'
            : 'text-[#475569] hover:text-[#94a3b8]'
        }`}
      >
        Daily
      </button>
    </div>
  )
}
