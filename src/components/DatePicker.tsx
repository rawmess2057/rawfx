'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function cls(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface DatePickerProps {
  value: string
  onChange: (v: string) => void
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = value ? new Date(value + 'T00:00:00') : null
  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])
  const [viewMonth, setViewMonth] = useState(selected ?? today)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()
  const startDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay()
  const weeks: (number | null)[][] = []
  let day: (number | null)[] = []
  for (let i = 0; i < startDay; i++) day.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    day.push(d)
    if (day.length === 7) {
      weeks.push(day)
      day = []
    }
  }
  if (day.length) weeks.push(day)

  function prev() { setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)) }
  function next() { setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)) }

  function isToday(d: number) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d)
    return date.getTime() === today.getTime()
  }

  function isSelected(d: number) {
    if (!selected) return false
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d)
    return date.getTime() === selected.getTime()
  }

  function select(d: number) {
    const m = String(viewMonth.getMonth() + 1).padStart(2, '0')
    const day = String(d).padStart(2, '0')
    onChange(`${viewMonth.getFullYear()}-${m}-${day}`)
    setOpen(false)
  }

  function formatDisplay(raw: string) {
    if (!raw) return ''
    const [y, m, d] = raw.split('-')
    return `${MONTHS[parseInt(m) - 1] || ''} ${parseInt(d)}, ${y}`
  }

  return (
    <div className="relative" ref={ref}>
      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Date</label>
      <input
        type="text"
        readOnly
        value={formatDisplay(value)}
        onFocus={() => setOpen(true)}
        placeholder="Select date"
        className="w-full bg-transparent border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#a855f7] cursor-pointer"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-[260px] z-30"
          >
            <div className="glass-green rounded-xl p-3 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={prev}
                  className="p-1 text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xs font-semibold text-[#f1f5f9]">
                  {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={next}
                  className="p-1 text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-[10px] font-semibold text-[#475569] py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {weeks.flat().map((d, i) =>
                  d ? (
                    <button
                      key={i}
                      type="button"
                      onClick={() => select(d)}
                      className={cls(
                        'py-1 text-xs rounded-md transition-all',
                        isSelected(d) && 'bg-[#a855f7] text-white',
                        !isSelected(d) && isToday(d) && 'text-[#14f5c7] font-semibold',
                        !isSelected(d) && !isToday(d) && 'text-[#94a3b8] hover:bg-white/[0.06] hover:text-[#f1f5f9]'
                      )}
                    >
                      {d}
                    </button>
                  ) : (
                    <div key={i} />
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
