import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yfCache: any = null

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

  try {
    const yf = await getYF()
    const result = await yf.search(q, { quotesCount: 8, newsCount: 0 })
    return NextResponse.json({ quotes: result.quotes })
  } catch (error) {
    console.error('[symbols/search]', error)
    return NextResponse.json({ quotes: [] })
  }
}
