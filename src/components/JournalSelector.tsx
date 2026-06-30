'use client'

import { useState } from 'react'
import { useJournalStore } from '@/store/journalStore'
import { JournalType } from '@/lib/journal-types'

const typeColors: Record<JournalType, string> = {
  BACKTEST: 'text-[#f59e0b]',
  FORWARD: 'text-[#a855f7]',
  LIVE: 'text-[#14f5c7]',
}

export default function JournalSelector() {
  const { journals, activeJournalId, switchJournal, createJournal } = useJournalStore()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<JournalType>('LIVE')
  const [strategy, setStrategy] = useState('')

  const active = journals.find(j => j.id === activeJournalId)

  async function handleCreate() {
    if (!name.trim()) return
    const journal = await createJournal(name.trim(), type, strategy.trim())
    if (journal) {
      setName('')
      setType('LIVE')
      setStrategy('')
      setCreateOpen(false)
      setOpen(false)
      await switchJournal(journal.id)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-white/5 transition-all"
      >
        <span className="text-[#f1f5f9]">{active?.name ?? 'Select Journal'}</span>
        {active && (
          <span className={`text-[10px] ${typeColors[active.type]}`}>
            {active.type}
          </span>
        )}
        <svg className="w-3 h-3 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-72 glass rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="max-h-64 overflow-auto">
              {journals.length === 0 ? (
                <div className="px-3 py-4 text-xs text-[#475569] text-center">
                  No journals yet
                </div>
              ) : (
                journals.map(j => (
                  <button
                    key={j.id}
                    onClick={() => { switchJournal(j.id); setOpen(false) }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-white/[0.04] transition-all ${
                      j.id === activeJournalId ? 'bg-white/[0.06]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#f1f5f9] font-semibold">{j.name}</span>
                      {j.strategy && (
                        <span className="text-[10px] text-[#475569]">{j.strategy}</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold ${typeColors[j.type]}`}>
                      {j.type}
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-white/5 p-2">
              <button
                onClick={() => { setCreateOpen(true); setOpen(false) }}
                className="w-full text-[10px] font-semibold text-[#14f5c7] hover:bg-white/[0.04] rounded-lg px-2 py-1.5 transition-all"
              >
                + New Journal
              </button>
            </div>
          </div>
        </>
      )}

      {createOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setCreateOpen(false)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={() => setCreateOpen(false)}>
            <div className="glass rounded-xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-xs font-semibold text-[#f1f5f9] mb-4">New Journal</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    placeholder="e.g. ICT Scalp"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as JournalType)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                  >
                    <option value="BACKTEST">Backtest</option>
                    <option value="FORWARD">Forward</option>
                    <option value="LIVE">Live</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Strategy (optional)</label>
                  <input
                    type="text"
                    value={strategy}
                    onChange={e => setStrategy(e.target.value)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    placeholder="e.g. ICT 2022"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="flex-1 text-[10px] font-semibold text-[#475569] hover:text-[#94a3b8] px-3 py-2 rounded-lg border border-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="flex-1 text-[10px] font-semibold text-[#0a0a0f] bg-[#14f5c7] hover:bg-[#14f5c7]/90 px-3 py-2 rounded-lg transition-all"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
