'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimePickerProps {
  value: string
  onChange: (v: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hoursRef = useRef<HTMLDivElement>(null)
  const minsRef = useRef<HTMLDivElement>(null)

  const [h, m] = value ? value.split(':') : ['', '']
  const selHour = HOURS.indexOf(h)
  const selMin = MINUTES.indexOf(m)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        if (selHour >= 0 && hoursRef.current) {
          hoursRef.current.children[selHour]?.scrollIntoView({ block: 'center' })
        }
        if (selMin >= 0 && minsRef.current) {
          minsRef.current.children[selMin]?.scrollIntoView({ block: 'center' })
        }
      })
    }
  }, [open, selHour, selMin])

  function select(hour: string, min: string) {
    onChange(`${hour}:${min}`)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Time</label>
      <input
        type="text"
        readOnly
        value={value}
        onFocus={() => setOpen(true)}
        placeholder="--:--"
        className="w-full bg-transparent border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#a855f7] cursor-pointer"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 z-30"
          >
            <div className="glass-green rounded-xl p-3 shadow-2xl">
              <div className="flex gap-2">
                <div
                  ref={hoursRef}
                  className="h-40 overflow-y-auto scroll-smooth space-y-0.5 pr-1 [&::-webkit-scrollbar]:w-1"
                >
                  {HOURS.map((hour, i) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => select(hour, m || '00')}
                      className={`block w-12 text-center py-1 rounded-md text-xs transition-all ${
                        i === selHour
                          ? 'bg-[#a855f7] text-white'
                          : 'text-[#94a3b8] hover:bg-white/[0.06] hover:text-[#f1f5f9]'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
                <div className="flex items-center text-[#475569] text-xs pt-1">:</div>
                <div
                  ref={minsRef}
                  className="h-40 overflow-y-auto scroll-smooth space-y-0.5 pr-1 [&::-webkit-scrollbar]:w-1"
                >
                  {MINUTES.map((min, i) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => select(h || '00', min)}
                      className={`block w-12 text-center py-1 rounded-md text-xs transition-all ${
                        i === selMin
                          ? 'bg-[#a855f7] text-white'
                          : 'text-[#94a3b8] hover:bg-white/[0.06] hover:text-[#f1f5f9]'
                      }`}
                    >
                      {min}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
