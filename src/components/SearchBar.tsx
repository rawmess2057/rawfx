'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
  symbol: string
  shortname?: string
  longname?: string
  quoteType?: string
  typeDisp?: string
  exchange?: string
}

interface Props {
  onSelect: (symbol: string) => void
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    setLoading(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/symbols/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.quotes || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(sym: SearchResult) {
    onSelect(sym.symbol)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIdx]) {
      handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const isOpen = open && (results.length > 0 || loading)

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="glass rounded-xl flex items-center px-3.5 py-2.5 gap-2.5">
        <svg className="w-4 h-4 text-[#475569] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="Search any symbol on Yahoo Finance..."
          className="flex-1 bg-transparent text-sm text-[#f1f5f9] placeholder-[#475569] outline-none"
        />
        {loading && (
          <svg className="w-3.5 h-3.5 text-[#475569] animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {query && !loading && (
          <button onClick={() => { setQuery('') }} className="text-[#475569] hover:text-[#94a3b8] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 glass rounded-xl overflow-hidden z-50 border border-white/5"
          >
            {results.length === 0 && loading && (
              <div className="px-3.5 py-2.5 text-xs text-[#475569]">Searching...</div>
            )}
            {results.map((sym, i) => (
              <button
                key={sym.symbol}
                onClick={() => handleSelect(sym)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                  i === activeIdx ? 'bg-white/5' : ''
                }`}
              >
                <span className="text-[10px] font-semibold text-[#94a3b8] uppercase w-16 shrink-0">
                  {sym.typeDisp || sym.quoteType || 'N/A'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#f1f5f9]">{sym.symbol}</span>
                  {sym.shortname && (
                    <span className="text-xs text-[#475569] ml-2 truncate">{sym.shortname}</span>
                  )}
                </div>
                {sym.exchange && (
                  <span className="text-[10px] text-[#475569] shrink-0">{sym.exchange}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
