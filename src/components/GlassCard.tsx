'use client'

interface Props {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'red' | 'purple' | 'none'
}

export default function GlassCard({ children, className = '', hover = false, glow = 'none' }: Props) {
  const glowClass = glow === 'green' ? 'glow-green' : glow === 'red' ? 'glow-red' : glow === 'purple' ? 'glow-purple' : ''
  return (
    <div className={`glass rounded-xl ${hover ? 'glass-hover transition-all duration-200' : ''} ${glowClass} ${className}`}>
      {children}
    </div>
  )
}
