'use client'

import { useState, useRef } from 'react'
import { JournalTrade } from '@/lib/journal-types'

type InitTrade = Partial<JournalTrade> & Record<string, unknown>

interface Props {
  initial: InitTrade
  onSave: (trade: JournalTrade) => void
  onClose: () => void
  criteriaLabels: string[]
}

export default function TradeForm({ initial, onSave, onClose, criteriaLabels }: Props) {
  const { durationCandles: initDur, maxRR: initRR, ...rest } = initial
  const [form, setForm] = useState({
    includeInAnalysis: true,
    symbol: '', date: '', time: '', stopLoss: 0, rrSecured: 0,
    durationCandles: initDur != null ? String(initDur) : '',
    maxRR: initRR != null ? String(initRR) : '',
    contextScreenshot: '', validationScreenshot: '', entryScreenshot: '', finalScreenshot: '',
    notes: '',
    criteria1: false, criteria2: false, criteria3: false, criteria4: false, criteria5: false,
    metOverallPlan: false,
    criteriaNotes: '', news: '', newsNotes: '', models: '', extra: '',
    ...rest,
  })

  function set(key: string, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trade: JournalTrade = {
      id: initial.id || crypto.randomUUID(),
      includeInAnalysis: form.includeInAnalysis,
      symbol: form.symbol,
      date: form.date,
      time: form.time,
      stopLoss: Number(form.stopLoss) || 0,
      rrSecured: Number(form.rrSecured) || 0,
      durationCandles: form.durationCandles ? Number(form.durationCandles) : null,
      maxRR: form.maxRR ? Number(form.maxRR) : null,
      contextScreenshot: form.contextScreenshot,
      validationScreenshot: form.validationScreenshot,
      entryScreenshot: form.entryScreenshot,
      finalScreenshot: form.finalScreenshot,
      notes: form.notes,
      criteria1: form.criteria1,
      criteria2: form.criteria2,
      criteria3: form.criteria3,
      criteria4: form.criteria4,
      criteria5: form.criteria5,
      metOverallPlan: form.metOverallPlan,
      criteriaNotes: form.criteriaNotes,
      news: form.news,
      newsNotes: form.newsNotes,
      models: form.models,
      extra: form.extra,

    }
    onSave(trade)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-sm font-bold text-[#f1f5f9]">{initial ? 'Edit Trade' : 'New Trade'}</h2>
          <button onClick={onClose} className="text-[#475569] hover:text-[#f43f5e] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Row 1: Core */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Symbol" value={form.symbol} onChange={v => set('symbol', v)} required />
            <Field label="Date" value={form.date} onChange={v => set('date', v)} type="date" />
            <Field label="Time" value={form.time} onChange={v => set('time', v)} type="time" />
            <Field label="Stop Loss" value={form.stopLoss} onChange={v => set('stopLoss', v)} type="number" />
          </div>

          {/* Row 2: RR, Duration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="RR Secured" value={form.rrSecured} onChange={v => set('rrSecured', v)} type="number" step="0.01" />
            <Field label="Duration (candles)" value={form.durationCandles} onChange={v => set('durationCandles', v)} type="number" />
            <Field label="Max RR" value={form.maxRR} onChange={v => set('maxRR', v)} type="number" step="0.01" />
            <Checkbox label="Include in Analysis" checked={form.includeInAnalysis} onChange={v => set('includeInAnalysis', v)} />
          </div>

          {/* Screenshots */}
          <div>
            <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Screenshots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ScreenshotField label="Context" value={form.contextScreenshot} onChange={v => set('contextScreenshot', v)} />
              <ScreenshotField label="Validation" value={form.validationScreenshot} onChange={v => set('validationScreenshot', v)} />
              <ScreenshotField label="Entry" value={form.entryScreenshot} onChange={v => set('entryScreenshot', v)} />
              <ScreenshotField label="Final" value={form.finalScreenshot} onChange={v => set('finalScreenshot', v)} />
            </div>
          </div>

          {/* Criteria */}
          <div>
            <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Criteria</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {criteriaLabels.map((label, i) => (
                <Checkbox key={i} label={label} checked={form[`criteria${i + 1}` as keyof typeof form] as boolean} onChange={v => set(`criteria${i + 1}` as keyof typeof form, v)} />
              ))}
              <Checkbox label="Met Overall Plan?" checked={form.metOverallPlan} onChange={v => set('metOverallPlan', v)} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Trade notes..."
              className="w-full bg-transparent border border-white/5 rounded-lg px-3 py-2 text-xs text-[#94a3b8] placeholder:text-[#475569] focus:outline-none focus:border-[#a855f7] resize-none h-20"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="glass rounded-lg px-4 py-2 text-xs font-semibold text-[#94a3b8] hover:text-[#f1f5f9] transition-all">
              Cancel
            </button>
            <button type="submit" className="glass rounded-lg px-4 py-2 text-xs font-semibold text-[#14f5c7] hover:bg-white/5 transition-all">
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required, step }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; required?: boolean; step?: string
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        step={step}
        className="w-full bg-transparent border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#a855f7]"
      />
    </div>
  )
}

function ScreenshotField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL or upload..."
          className="flex-1 w-full bg-transparent border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#a855f7]"
        />
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="glass rounded-lg px-2 py-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5 transition-all shrink-0"
        >
          Browse
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[#475569] hover:text-[#f43f5e] transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {value && (
        <div className="mt-1.5 relative inline-block">
          <img
            src={value}
            alt={label}
            className="max-h-16 rounded border border-white/5 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 accent-[#a855f7]"
      />
      <span className="text-xs text-[#94a3b8]">{label}</span>
    </label>
  )
}
