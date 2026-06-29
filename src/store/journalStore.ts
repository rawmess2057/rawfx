'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JournalTrade, JournalConfig, JournalStats, computeStats } from '@/lib/journal-types'

interface JournalState {
  trades: JournalTrade[]
  config: JournalConfig
  loading: boolean
  error: string | null
  _hydrated: boolean
  fetchTrades: () => Promise<void>
  addTrade: (trade: JournalTrade) => Promise<void>
  updateTrade: (id: string, trade: Partial<JournalTrade>) => Promise<void>
  deleteTrade: (id: string) => Promise<void>
  setConfig: (config: Partial<JournalConfig>) => void
  importTrades: (trades: JournalTrade[]) => Promise<void>
  getStats: () => JournalStats
}

const defaultConfig: JournalConfig = {
  accountBalance: 1_000_000,
  riskPercent: 0.5,
  contextTimeframe: '1h',
  validationTimeframe: '15m',
  entryTimeframe: '5m',
  costsPerTrade: 0.1,
  maxLossPercent: 100,
  criteriaLabels: ['Criteria 1', 'Criteria 2', 'Criteria 3', 'Criteria 4', 'Criteria 5'],
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      trades: [],
      config: { ...defaultConfig },
      loading: false,
      error: null,
      _hydrated: false,

      fetchTrades: async () => {
        set({ loading: true, error: null })
        try {
          const res = await fetch('/api/trades')
          if (!res.ok) throw new Error('Failed to fetch trades')
          const data = await res.json()
          set({ trades: data.trades, loading: false })
        } catch {
          set({ error: 'Failed to load trades', loading: false })
        }
      },

      addTrade: async (trade) => {
        try {
          const res = await fetch('/api/trades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trade),
          })
          if (!res.ok) throw new Error('Failed to create trade')
          const data = await res.json()
          set({ trades: [...get().trades, data.trade] })
        } catch {
          set({ error: 'Failed to save trade' })
        }
      },

      updateTrade: async (id, partial) => {
        try {
          const res = await fetch(`/api/trades/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partial),
          })
          if (!res.ok) throw new Error('Failed to update trade')
          const data = await res.json()
          set({
            trades: get().trades.map(t => (t.id === id ? data.trade : t)),
          })
        } catch {
          set({ error: 'Failed to update trade' })
        }
      },

      deleteTrade: async (id) => {
        try {
          const res = await fetch(`/api/trades/${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete trade')
          set({ trades: get().trades.filter(t => t.id !== id) })
        } catch {
          set({ error: 'Failed to delete trade' })
        }
      },

      setConfig: (partial) => {
        set({ config: { ...get().config, ...partial } })
      },

      importTrades: async (trades) => {
        const existing = get().trades
        const ids = new Set(existing.map(t => t.id))
        const newTrades = trades.filter(t => !ids.has(t.id))

        for (const trade of newTrades) {
          try {
            const res = await fetch('/api/trades', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(trade),
            })
            if (res.ok) {
              const data = await res.json()
              existing.push(data.trade)
            }
          } catch { /* skip failed imports */ }
        }

        set({ trades: [...existing] })
      },

      getStats: () => computeStats(get().trades, get().config),
    }),
    {
      name: 'rawfx-journal-config',
      partialize: (state) => ({ config: state.config }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<JournalState>
        return {
          ...currentState,
          ...persisted,
          config: { ...defaultConfig, ...persisted.config },
          _hydrated: true,
        }
      },
    }
  )
)
