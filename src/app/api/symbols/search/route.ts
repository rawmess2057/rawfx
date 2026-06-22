import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yfCache: any = null

interface CacheEntry {
  data: unknown[]
  ts: number
}

const searchCache = new Map<string, CacheEntry>()
const CACHE_TTL = 5 * 60 * 1000

function getCached(q: string): unknown[] | null {
  const entry = searchCache.get(q)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) {
    searchCache.delete(q)
    return null
  }
  return entry.data
}

function setCached(q: string, data: unknown[]) {
  searchCache.set(q, { data, ts: Date.now() })
  // Evict stale entries periodically
  if (searchCache.size > 100) {
    const now = Date.now()
    for (const [key, entry] of searchCache) {
      if (now - entry.ts > CACHE_TTL) searchCache.delete(key)
    }
  }
}

async function getYF() {
  if (!yfCache) {
    const YahooFinance = (await import('yahoo-finance2')).default
    yfCache = new YahooFinance()
  }
  return yfCache as {
    search: (q: string, opts?: { quotesCount?: number; newsCount?: number }) => Promise<{ quotes: unknown[] }>
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  if (!q || q.length < 1) return NextResponse.json({ quotes: [] })

  const cached = getCached(q)
  if (cached) return NextResponse.json({ quotes: cached })

  try {
    const yf = await getYF()
    const result = await yf.search(q, { quotesCount: 8, newsCount: 0 })
    setCached(q, result.quotes)
    return NextResponse.json({ quotes: result.quotes })
  } catch (error) {
    console.error('[symbols/search]', error)
    return NextResponse.json({ quotes: [] })
  }
}
