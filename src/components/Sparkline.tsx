'use client'

interface Props {
  data: number[]
  width?: number
  height?: number
  bull?: boolean
}

export default function Sparkline({ data, width = 60, height = 24, bull = true }: Props) {
  if (data.length < 2) return <div style={{ width, height }} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 2) - 1
    return `${x},${y}`
  })

  const path = `M${points.join(' L')}`
  const color = bull ? '#14f5c7' : '#f43f5e'

  return (
    <svg width={width} height={height} className="shrink-0">
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={`${path} L${width},${height} L0,${height} Z`}
        fill={`url(#grad-${bull ? 'g' : 'r'})`}
        opacity={0.15}
      />
      <defs>
        <linearGradient id="grad-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14f5c7" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#14f5c7" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="grad-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}
