import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'RawFX — Institutional Sentiment Analyzer',
  description: 'Multi-timeframe sentiment analysis for US Stocks, Crypto, and Forex',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <NavBar />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
