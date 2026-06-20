'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { fetchFFCalendar, type FFEvent } from '@/lib/forex-factory'

const IMPACT_COLORS: Record<string, string> = {
  High: 'text-[#f43f5e] bg-[#f43f5e]/10',
  Medium: 'text-[#f59e0b] bg-[#f59e0b]/10',
  Holiday: 'text-[#475569] bg-white/5',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function formatDay(iso: string) {
  const d = new Date(iso)
  return `${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 || 12
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function NewsBell() {
  const [events, setEvents] = useState<FFEvent[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  const load = useCallback(() => {
    fetchFFCalendar().then(data => { setEvents(data); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const hasHigh = events.some(e => e.impact === 'High')

  const groups: { day: string; events: FFEvent[] }[] = []
  let lastDay = ''
  for (const e of events) {
    const day = formatDay(e.date)
    if (day !== lastDay) {
      groups.push({ day, events: [] })
      lastDay = day
    }
    groups[groups.length - 1].events.push(e)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 text-[#475569] hover:text-[#94a3b8] transition-colors"
        title="Forex Factory Calendar"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {hasHigh && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse-dot" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 glass rounded-xl border border-white/5 shadow-2xl animate-slide-in-right overflow-hidden z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">Calendar</h3>
            <button
              onClick={() => { setLoading(true); load() }}
              className="text-[#475569] hover:text-[#94a3b8] transition-colors p-0.5"
              title="Refresh"
            >
              <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {loading && events.length === 0 ? (
            <div className="p-6 text-center text-[10px] text-[#475569]">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-center text-[10px] text-[#475569]">No events this week</div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {groups.map(g => (
                <div key={g.day}>
                  <div className="sticky top-0 z-10 px-3 py-1.5 text-[9px] font-semibold text-[#475569] uppercase tracking-wider border-b border-white/5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    {g.day}
                  </div>
                  {g.events.map((e, i) => {
                    const impactClass = IMPACT_COLORS[e.impact] || 'text-[#475569] bg-white/5'
                    return (
                      <div key={i} className="px-3 py-2 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#f1f5f9] truncate mr-2">{e.title}</span>
                          <span className={`shrink-0 text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${impactClass}`}>{e.impact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-[#475569]">
                          <span>{formatTime(e.date)}</span>
                          <span>{e.country}</span>
                          {e.forecast && <span>Forecast: {e.forecast}</span>}
                          {e.previous && <span>Prev: {e.previous}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
