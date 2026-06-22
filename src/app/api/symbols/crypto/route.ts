import { NextResponse } from 'next/server'

interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  current_price: number
}

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false',
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) throw new Error(`CoinGecko returned ${res.status}`)

    const coins: CoinGeckoCoin[] = await res.json()
    const symbols = coins
      .filter(c => {
        if (!c.symbol || c.current_price == null) return false
        if (c.current_price < 0.000001) return false
        if (!/^[a-zA-Z0-9]+$/.test(c.symbol)) return false
        return true
      })
      .map(c => {
        const sym = c.symbol.toUpperCase()
        return {
          symbol: `${sym}-USD`,
          display: `${sym}/USD`,
          category: 'crypto' as const,
          yahooTicker: `${sym}-USD`,
        }
      })

    return NextResponse.json({ symbols, count: symbols.length })
  } catch (error) {
    console.error('[symbols/crypto]', error)
    return NextResponse.json({ symbols: [], count: 0 })
  }
}
