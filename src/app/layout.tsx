import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RawFX — Institutional Sentiment Analyzer',
  description: 'Multi-timeframe sentiment analysis for US Stocks, Crypto, and Forex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
