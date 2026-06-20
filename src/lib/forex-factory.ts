export interface FFEvent {
  title: string
  country: string
  date: string
  impact: string
  forecast?: string
  previous?: string
}

const CACHE_TTL = 5 * 60 * 1000
let cache: { data: FFEvent[]; ts: number } | null = null

export async function fetchFFCalendar(): Promise<FFEvent[]> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data
  try {
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', { cache: 'no-store' })
    if (!res.ok) return []
    const data: FFEvent[] = await res.json()
    const filtered = data.filter(e => e.impact === 'High' || e.impact === 'Medium')
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    cache = { data: filtered, ts: Date.now() }
    return filtered
  } catch {
    return cache?.data ?? []
  }
}
