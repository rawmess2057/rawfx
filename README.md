# RawFX

Multi-timeframe institutional-grade sentiment analysis and trade journal for traders.

Built with Next.js 16, React 19, TypeScript, and PostgreSQL.

## Features

- **Sentiment Dashboard** — Real-time scoring across 15m/1h/1d timeframes. Technical analysis engine computes market structure (BOS/CHOCH), EMA alignment, momentum, ADX trend strength, chop index, RSI divergence, candle flow, and market phases (Accumulation, Markup, Distribution, Markdown).
- **Trade Journal** — Log trades with symbol, date/time, stop loss, R-multiple achieved, duration, 5-criteria checklist, and notes. Screenshot fields accept both TradingView URLs and local file uploads (stored as base64).
- **Performance Analytics** — Win rate, profit factor, expectancy, ROI, max drawdown, risk of ruin, equity curve, calendar heatmap, breakdown by day/month, and drawdown period analysis.
- **Economic Calendar** — This week's high/medium impact economic events from Forex Factory.
- **OAuth Authentication** — Sign in with Google or GitHub via NextAuth.js v5.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 (dark theme, glassmorphism) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma 7 with `@prisma/adapter-pg` |
| Auth | NextAuth.js v5 (Google + GitHub OAuth) |
| State | Zustand 5 (persisted stores) |
| Data | Yahoo Finance (OHLCV, search), CoinGecko (crypto top 250), Forex Factory (calendar) |
| Animations | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Prisma Postgres recommended)

### Installation

```bash
git clone <repo-url>
cd rawfx
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgres://..."
AUTH_SECRET="generate with `openssl rand -base64 32`"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-app-id"
AUTH_GITHUB_SECRET="your-github-app-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Database

Push the Prisma schema to your database:

```bash
npx prisma db push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

| Route | Page |
|-------|------|
| `/` | Sentiment dashboard — search/filter symbols, view multi-timeframe sentiment scores |
| `/journal` | Trade journal — add/edit/delete trades, import/export JSON/CSV, view analytics |
| `/news` | Economic calendar — weekly high/medium impact events |
| `/login` | Sign in with Google or GitHub |

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth.js handler
│   │   ├── trades/          # Trade CRUD
│   │   ├── sentiment/       # Sentiment analysis endpoint
│   │   ├── symbols/         # Symbol search + crypto top 250
│   │   └── calendar/        # Economic calendar proxy
│   ├── journal/             # Trade journal page
│   ├── news/                # Economic calendar page
│   └── login/               # OAuth login page
├── components/              # React components
│   ├── Dashboard.tsx        # Sentiment page orchestrator
│   ├── DetailPanel.tsx      # Symbol detail slide-out panel
│   ├── SentimentTable.tsx   # Sortable sentiment table
│   ├── SentimentBar.tsx     # Bull/bear percentage bar
│   ├── Sparkline.tsx        # SVG mini chart
│   ├── PhaseLabel.tsx       # Market phase badge
│   ├── TradeForm.tsx        # Add/edit trade modal
│   ├── AnalysisTab.tsx      # Performance analytics
│   └── NavBar.tsx           # Top navigation
├── lib/                     # Core logic
│   ├── sentiment.ts         # Sentiment analysis engine
│   ├── indicators.ts        # Technical indicators (EMA, RSI, ADX, etc.)
│   ├── journal-types.ts     # Trade types + stats computation
│   ├── data-fetcher.ts      # Yahoo Finance client
│   └── forex-factory.ts     # Calendar client
├── store/                   # Zustand state stores
│   ├── useStore.ts          # Sentiment dashboard store
│   └── journalStore.ts      # Trade journal store
├── constants/
│   └── symbols.ts           # 250+ predefined symbols across 7 categories
└── auth.ts                  # NextAuth.js configuration
```

## Deployment

Deploy on Vercel:

1. Push to GitHub
2. Import project on Vercel
3. Set environment variables
4. The `vercel-build` script handles Prisma generation automatically

```bash
# Build command (already in package.json)
vercel-build: prisma generate && next build
```
