import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'RawFX — Institutional Sentiment Analyzer',
  description: 'Multi-timeframe sentiment analysis for US Stocks, Crypto, and Forex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
