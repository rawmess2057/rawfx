'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JournalTrade, JournalConfig, JournalStats, computeStats } from '@/lib/journal-types'

interface JournalState {
  trades: JournalTrade[]
  config: JournalConfig
  addTrade: (trade: JournalTrade) => void
  updateTrade: (id: string, trade: Partial<JournalTrade>) => void
  deleteTrade: (id: string) => void
  setConfig: (config: Partial<JournalConfig>) => void
  importTrades: (trades: JournalTrade[]) => void
  getStats: () => JournalStats
}

const defaultConfig: JournalConfig = {
  accountBalance: 1_000_000,
  riskPercent: 0.5,
  entryTimeframeMin: 30,
  costsPerTrade: 0.1,
  maxLossPercent: 100,
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export const useJournalStore = create<JournalState>()(
    persist(
      (set, get) => ({
        trades: [] as JournalTrade[],
        config: { ...defaultConfig },

        addTrade: (trade) => {
          set({ trades: [...get().trades, { ...trade, id: trade.id || generateId() }] })
        },

      updateTrade: (id, partial) => {
        set({
          trades: get().trades.map(t => t.id === id ? { ...t, ...partial } : t),
        })
      },

      deleteTrade: (id) => {
        set({ trades: get().trades.filter(t => t.id !== id) })
      },

      setConfig: (partial) => {
        set({ config: { ...get().config, ...partial } })
      },

      importTrades: (trades) => {
        const existing = get().trades
        const ids = new Set(existing.map(t => t.id))
        const newTrades = trades.filter(t => !ids.has(t.id))
        set({ trades: [...existing, ...newTrades] })
      },

      getStats: () => computeStats(get().trades, get().config),
    }),
    { name: 'rawfx-journal' }
  )
)
