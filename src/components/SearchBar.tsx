'use client'

import { useRef } from 'react'

interface Props {
  value: string
  onChange: (query: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative w-full max-w-md">
      <div className="glass rounded-xl flex items-center px-3.5 py-2.5 gap-2.5">
        <svg className="w-4 h-4 text-[#475569] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Filter watchlist..."
          className="flex-1 bg-transparent text-sm text-[#f1f5f9] placeholder-[#475569] outline-none"
        />
        {value && (
          <button onClick={() => onChange('')} className="text-[#475569] hover:text-[#94a3b8] transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
