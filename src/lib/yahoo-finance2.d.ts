declare module 'yahoo-finance2' {
  interface ChartQuote {
    date: Date
    open: number
    high: number
    low: number
    close: number
    volume: number
  }

  interface ChartResult {
    meta: Record<string, unknown>
    quotes: ChartQuote[]
  }

  interface ChartOptions {
    interval: string
    period1: string
  }

  interface YahooFinance {
    chart(ticker: string, options: ChartOptions): Promise<ChartResult>
  }

  interface YahooFinanceConstructor {
    new(): YahooFinance
  }

  const yf: YahooFinanceConstructor
  export default yf
}
