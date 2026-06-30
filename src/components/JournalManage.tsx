'use client'

import { useState } from 'react'
import { useJournalStore } from '@/store/journalStore'
import { Journal, JournalType } from '@/lib/journal-types'
import ConfirmDialog from '@/components/ConfirmDialog'

const typeColors: Record<JournalType, string> = {
  BACKTEST: 'text-[#f59e0b]',
  FORWARD: 'text-[#a855f7]',
  LIVE: 'text-[#14f5c7]',
}

export default function JournalManage() {
  const { journals, activeJournalId, switchJournal, updateJournal, deleteJournal, createJournal } = useJournalStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState<JournalType>('LIVE')
  const [editStrategy, setEditStrategy] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<JournalType>('LIVE')
  const [newStrategy, setNewStrategy] = useState('')

  function startEdit(j: Journal) {
    setEditingId(j.id)
    setEditName(j.name)
    setEditType(j.type)
    setEditStrategy(j.strategy)
  }

  async function handleSave(id: string) {
    await updateJournal(id, { name: editName.trim(), type: editType, strategy: editStrategy.trim() })
    setEditingId(null)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    const j = await createJournal(newName.trim(), newType, newStrategy.trim())
    if (j) {
      setShowCreate(false)
      setNewName('')
      setNewType('LIVE')
      setNewStrategy('')
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 p-6 pt-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Journals ({journals.length})</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="glass rounded-lg px-3 py-1.5 text-xs font-semibold text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5 transition-all"
        >
          + New Journal
        </button>
      </div>

      {journals.length === 0 ? (
        <div className="glass rounded-xl flex items-center justify-center h-48 text-sm text-[#475569]">
          No journals yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {journals.map(j => (
            <div
              key={j.id}
              className={`glass rounded-xl p-3 ${j.id === activeJournalId ? 'ring-1 ring-[#14f5c7]/30' : ''}`}
            >
              {editingId === j.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editType}
                      onChange={e => setEditType(e.target.value as JournalType)}
                      className="flex-1 bg-transparent border border-white/5 rounded-lg px-2 py-1 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    >
                      <option value="BACKTEST">Backtest</option>
                      <option value="FORWARD">Forward</option>
                      <option value="LIVE">Live</option>
                    </select>
                    <input
                      type="text"
                      value={editStrategy}
                      onChange={e => setEditStrategy(e.target.value)}
                      placeholder="Strategy"
                      className="flex-1 bg-transparent border border-white/5 rounded-lg px-2 py-1 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[10px] font-semibold text-[#475569] hover:text-[#94a3b8] px-2 py-1 rounded border border-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(j.id)}
                      className="text-[10px] font-semibold text-[#0a0a0f] bg-[#14f5c7] px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => switchJournal(j.id)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs font-semibold text-[#f1f5f9]">{j.name}</span>
                      <span className={`text-[10px] font-semibold ${typeColors[j.type]}`}>
                        {j.type}
                      </span>
                      {j.strategy && (
                        <span className="text-[10px] text-[#475569]">{j.strategy}</span>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(j)}
                      className="text-[#475569] hover:text-[#94a3b8] transition-colors p-1"
                      title="Edit"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(j.id)}
                      className="text-[#475569] hover:text-[#f43f5e] transition-colors p-1"
                      title="Delete"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
            <div className="glass rounded-xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-xs font-semibold text-[#f1f5f9] mb-4">New Journal</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    placeholder="e.g. ICT Scalp"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as JournalType)}
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
                    value={newStrategy}
                    onChange={e => setNewStrategy(e.target.value)}
                    className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
                    placeholder="e.g. ICT 2022"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowCreate(false)}
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

      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Delete journal?"
        message="This will permanently delete this journal and ALL trades in it. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (deleteConfirmId) deleteJournal(deleteConfirmId); setDeleteConfirmId(null) }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}
