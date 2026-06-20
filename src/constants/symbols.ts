import { SymbolDef } from '@/lib/types'

const FX_MAJORS: SymbolDef[] = [
  { symbol: 'EUR/USD', display: 'EUR/USD', category: 'forex', yahooTicker: 'EURUSD=X' },
  { symbol: 'GBP/USD', display: 'GBP/USD', category: 'forex', yahooTicker: 'GBPUSD=X' },
  { symbol: 'USD/JPY', display: 'USD/JPY', category: 'forex', yahooTicker: 'USDJPY=X' },
  { symbol: 'AUD/USD', display: 'AUD/USD', category: 'forex', yahooTicker: 'AUDUSD=X' },
  { symbol: 'USD/CAD', display: 'USD/CAD', category: 'forex', yahooTicker: 'USDCAD=X' },
  { symbol: 'NZD/USD', display: 'NZD/USD', category: 'forex', yahooTicker: 'NZDUSD=X' },
  { symbol: 'USD/CHF', display: 'USD/CHF', category: 'forex', yahooTicker: 'USDCHF=X' },
]

const FX_CROSSES: SymbolDef[] = [
  { symbol: 'EUR/GBP', display: 'EUR/GBP', category: 'forex', yahooTicker: 'EURGBP=X' },
  { symbol: 'EUR/JPY', display: 'EUR/JPY', category: 'forex', yahooTicker: 'EURJPY=X' },
  { symbol: 'EUR/CHF', display: 'EUR/CHF', category: 'forex', yahooTicker: 'EURCHF=X' },
  { symbol: 'EUR/AUD', display: 'EUR/AUD', category: 'forex', yahooTicker: 'EURAUD=X' },
  { symbol: 'EUR/NZD', display: 'EUR/NZD', category: 'forex', yahooTicker: 'EURNZD=X' },
  { symbol: 'EUR/CAD', display: 'EUR/CAD', category: 'forex', yahooTicker: 'EURCAD=X' },
  { symbol: 'GBP/JPY', display: 'GBP/JPY', category: 'forex', yahooTicker: 'GBPJPY=X' },
  { symbol: 'GBP/CHF', display: 'GBP/CHF', category: 'forex', yahooTicker: 'GBPCHF=X' },
  { symbol: 'GBP/AUD', display: 'GBP/AUD', category: 'forex', yahooTicker: 'GBPAUD=X' },
  { symbol: 'GBP/NZD', display: 'GBP/NZD', category: 'forex', yahooTicker: 'GBPNZD=X' },
  { symbol: 'GBP/CAD', display: 'GBP/CAD', category: 'forex', yahooTicker: 'GBPCAD=X' },
  { symbol: 'AUD/JPY', display: 'AUD/JPY', category: 'forex', yahooTicker: 'AUDJPY=X' },
  { symbol: 'AUD/NZD', display: 'AUD/NZD', category: 'forex', yahooTicker: 'AUDNZD=X' },
  { symbol: 'AUD/CAD', display: 'AUD/CAD', category: 'forex', yahooTicker: 'AUDCAD=X' },
  { symbol: 'NZD/JPY', display: 'NZD/JPY', category: 'forex', yahooTicker: 'NZDJPY=X' },
  { symbol: 'NZD/CAD', display: 'NZD/CAD', category: 'forex', yahooTicker: 'NZDCAD=X' },
  { symbol: 'CHF/JPY', display: 'CHF/JPY', category: 'forex', yahooTicker: 'CHFJPY=X' },
]

const FX_EXOTICS: SymbolDef[] = [
  { symbol: 'USD/TRY', display: 'USD/TRY', category: 'forex', yahooTicker: 'USDTRY=X' },
  { symbol: 'USD/ZAR', display: 'USD/ZAR', category: 'forex', yahooTicker: 'USDZAR=X' },
  { symbol: 'USD/MXN', display: 'USD/MXN', category: 'forex', yahooTicker: 'USDMXN=X' },
  { symbol: 'USD/SGD', display: 'USD/SGD', category: 'forex', yahooTicker: 'USDSGD=X' },
  { symbol: 'USD/HKD', display: 'USD/HKD', category: 'forex', yahooTicker: 'USDHKD=X' },
  { symbol: 'USD/SEK', display: 'USD/SEK', category: 'forex', yahooTicker: 'USDSEK=X' },
  { symbol: 'USD/NOK', display: 'USD/NOK', category: 'forex', yahooTicker: 'USDNOK=X' },
  { symbol: 'USD/DKK', display: 'USD/DKK', category: 'forex', yahooTicker: 'USDDKK=X' },
  { symbol: 'USD/PLN', display: 'USD/PLN', category: 'forex', yahooTicker: 'USDPLN=X' },
  { symbol: 'USD/ILS', display: 'USD/ILS', category: 'forex', yahooTicker: 'USDILS=X' },
  { symbol: 'USD/THB', display: 'USD/THB', category: 'forex', yahooTicker: 'USDTHB=X' },
  { symbol: 'USD/KRW', display: 'USD/KRW', category: 'forex', yahooTicker: 'USDKRW=X' },
  { symbol: 'USD/INR', display: 'USD/INR', category: 'forex', yahooTicker: 'USDINR=X' },
  { symbol: 'USD/BRL', display: 'USD/BRL', category: 'forex', yahooTicker: 'USDBRL=X' },
]

const CRYPTO: SymbolDef[] = [
  { symbol: 'BTC/USD', display: 'BTC/USD', category: 'crypto', yahooTicker: 'BTC-USD' },
  { symbol: 'ETH/USD', display: 'ETH/USD', category: 'crypto', yahooTicker: 'ETH-USD' },
  { symbol: 'SOL/USD', display: 'SOL/USD', category: 'crypto', yahooTicker: 'SOL-USD' },
  { symbol: 'XRP/USD', display: 'XRP/USD', category: 'crypto', yahooTicker: 'XRP-USD' },
  { symbol: 'ADA/USD', display: 'ADA/USD', category: 'crypto', yahooTicker: 'ADA-USD' },
  { symbol: 'DOGE/USD', display: 'DOGE/USD', category: 'crypto', yahooTicker: 'DOGE-USD' },
  { symbol: 'DOT/USD', display: 'DOT/USD', category: 'crypto', yahooTicker: 'DOT-USD' },
  { symbol: 'AVAX/USD', display: 'AVAX/USD', category: 'crypto', yahooTicker: 'AVAX-USD' },
  { symbol: 'LINK/USD', display: 'LINK/USD', category: 'crypto', yahooTicker: 'LINK-USD' },
  { symbol: 'MATIC/USD', display: 'MATIC/USD', category: 'crypto', yahooTicker: 'MATIC-USD' },
  { symbol: 'UNI/USD', display: 'UNI/USD', category: 'crypto', yahooTicker: 'UNI-USD' },
  { symbol: 'ATOM/USD', display: 'ATOM/USD', category: 'crypto', yahooTicker: 'ATOM-USD' },
  { symbol: 'LTC/USD', display: 'LTC/USD', category: 'crypto', yahooTicker: 'LTC-USD' },
  { symbol: 'BCH/USD', display: 'BCH/USD', category: 'crypto', yahooTicker: 'BCH-USD' },
  { symbol: 'XLM/USD', display: 'XLM/USD', category: 'crypto', yahooTicker: 'XLM-USD' },
  { symbol: 'FTM/USD', display: 'FTM/USD', category: 'crypto', yahooTicker: 'FTM-USD' },
  { symbol: 'NEAR/USD', display: 'NEAR/USD', category: 'crypto', yahooTicker: 'NEAR-USD' },
  { symbol: 'APT/USD', display: 'APT/USD', category: 'crypto', yahooTicker: 'APT-USD' },
  { symbol: 'ARB/USD', display: 'ARB/USD', category: 'crypto', yahooTicker: 'ARB-USD' },
  { symbol: 'OP/USD', display: 'OP/USD', category: 'crypto', yahooTicker: 'OP-USD' },
]

const STOCKS: SymbolDef[] = [
  // Tech - Mega Cap
  { symbol: 'AAPL', display: 'AAPL', category: 'stock', yahooTicker: 'AAPL' },
  { symbol: 'NVDA', display: 'NVDA', category: 'stock', yahooTicker: 'NVDA' },
  { symbol: 'MSFT', display: 'MSFT', category: 'stock', yahooTicker: 'MSFT' },
  { symbol: 'AMZN', display: 'AMZN', category: 'stock', yahooTicker: 'AMZN' },
  { symbol: 'GOOGL', display: 'GOOGL', category: 'stock', yahooTicker: 'GOOGL' },
  { symbol: 'META', display: 'META', category: 'stock', yahooTicker: 'META' },
  { symbol: 'TSLA', display: 'TSLA', category: 'stock', yahooTicker: 'TSLA' },
  { symbol: 'AVGO', display: 'AVGO', category: 'stock', yahooTicker: 'AVGO' },
  { symbol: 'ORCL', display: 'ORCL', category: 'stock', yahooTicker: 'ORCL' },
  { symbol: 'CRM', display: 'CRM', category: 'stock', yahooTicker: 'CRM' },
  { symbol: 'AMD', display: 'AMD', category: 'stock', yahooTicker: 'AMD' },
  { symbol: 'INTC', display: 'INTC', category: 'stock', yahooTicker: 'INTC' },
  { symbol: 'IBM', display: 'IBM', category: 'stock', yahooTicker: 'IBM' },
  { symbol: 'CSCO', display: 'CSCO', category: 'stock', yahooTicker: 'CSCO' },
  { symbol: 'QCOM', display: 'QCOM', category: 'stock', yahooTicker: 'QCOM' },
  { symbol: 'ADBE', display: 'ADBE', category: 'stock', yahooTicker: 'ADBE' },
  { symbol: 'NFLX', display: 'NFLX', category: 'stock', yahooTicker: 'NFLX' },
  { symbol: 'NOW', display: 'NOW', category: 'stock', yahooTicker: 'NOW' },
  // Consumer
  { symbol: 'WMT', display: 'WMT', category: 'stock', yahooTicker: 'WMT' },
  { symbol: 'COST', display: 'COST', category: 'stock', yahooTicker: 'COST' },
  { symbol: 'HD', display: 'HD', category: 'stock', yahooTicker: 'HD' },
  { symbol: 'MCD', display: 'MCD', category: 'stock', yahooTicker: 'MCD' },
  { symbol: 'DIS', display: 'DIS', category: 'stock', yahooTicker: 'DIS' },
  { symbol: 'SBUX', display: 'SBUX', category: 'stock', yahooTicker: 'SBUX' },
  { symbol: 'NKE', display: 'NKE', category: 'stock', yahooTicker: 'NKE' },
  // Financial
  { symbol: 'JPM', display: 'JPM', category: 'stock', yahooTicker: 'JPM' },
  { symbol: 'V', display: 'V', category: 'stock', yahooTicker: 'V' },
  { symbol: 'MA', display: 'MA', category: 'stock', yahooTicker: 'MA' },
  { symbol: 'BAC', display: 'BAC', category: 'stock', yahooTicker: 'BAC' },
  { symbol: 'GS', display: 'GS', category: 'stock', yahooTicker: 'GS' },
  { symbol: 'BRK-B', display: 'BRK.B', category: 'stock', yahooTicker: 'BRK-B' },
  // Healthcare
  { symbol: 'UNH', display: 'UNH', category: 'stock', yahooTicker: 'UNH' },
  { symbol: 'JNJ', display: 'JNJ', category: 'stock', yahooTicker: 'JNJ' },
  { symbol: 'LLY', display: 'LLY', category: 'stock', yahooTicker: 'LLY' },
  { symbol: 'PFE', display: 'PFE', category: 'stock', yahooTicker: 'PFE' },
  { symbol: 'MRK', display: 'MRK', category: 'stock', yahooTicker: 'MRK' },
  { symbol: 'ABBV', display: 'ABBV', category: 'stock', yahooTicker: 'ABBV' },
  // Energy & Industrial
  { symbol: 'XOM', display: 'XOM', category: 'stock', yahooTicker: 'XOM' },
  { symbol: 'CVX', display: 'CVX', category: 'stock', yahooTicker: 'CVX' },
  { symbol: 'CAT', display: 'CAT', category: 'stock', yahooTicker: 'CAT' },
  { symbol: 'GE', display: 'GE', category: 'stock', yahooTicker: 'GE' },
  { symbol: 'BA', display: 'BA', category: 'stock', yahooTicker: 'BA' },
]

const INDICES: SymbolDef[] = [
  { symbol: 'SPY', display: 'SPY', category: 'index', yahooTicker: 'SPY' },
  { symbol: 'QQQ', display: 'QQQ', category: 'index', yahooTicker: 'QQQ' },
  { symbol: 'IWM', display: 'IWM', category: 'index', yahooTicker: 'IWM' },
  { symbol: 'DIA', display: 'DIA', category: 'index', yahooTicker: 'DIA' },
  { symbol: 'VTI', display: 'VTI', category: 'index', yahooTicker: 'VTI' },
  { symbol: 'VOO', display: 'VOO', category: 'index', yahooTicker: 'VOO' },
  { symbol: 'TLT', display: 'TLT', category: 'index', yahooTicker: 'TLT' },
  { symbol: 'GLD', display: 'GLD', category: 'index', yahooTicker: 'GLD' },
  { symbol: 'SLV', display: 'SLV', category: 'index', yahooTicker: 'SLV' },
  { symbol: 'USO', display: 'USO', category: 'index', yahooTicker: 'USO' },
  { symbol: 'VIX', display: 'VIX', category: 'index', yahooTicker: '^VIX' },
  { symbol: 'SPX', display: 'SPX', category: 'index', yahooTicker: '^GSPC' },
  { symbol: 'NDX', display: 'NDX', category: 'index', yahooTicker: '^NDX' },
  { symbol: 'DJI', display: 'DJI', category: 'index', yahooTicker: '^DJI' },
  { symbol: 'RUT', display: 'RUT', category: 'index', yahooTicker: '^RUT' },
  { symbol: 'FTSE', display: 'FTSE', category: 'index', yahooTicker: '^FTSE' },
  { symbol: 'DAX', display: 'DAX', category: 'index', yahooTicker: '^GDAXI' },
  { symbol: 'NKY', display: 'NKY', category: 'index', yahooTicker: '^N225' },
  { symbol: 'HSI', display: 'HSI', category: 'index', yahooTicker: '^HSI' },
  { symbol: 'AXJO', display: 'AXJO', category: 'index', yahooTicker: '^AXJO' },
]

export const SYMBOLS: SymbolDef[] = [
  ...FX_MAJORS,
  ...FX_CROSSES,
  ...FX_EXOTICS,
  ...CRYPTO,
  ...STOCKS,
  ...INDICES,
]

// Remove duplicates (AMZN appears twice across categories)
export const UNIQUE_SYMBOLS = SYMBOLS.filter(
  (s, i, arr) => arr.findIndex(x => x.symbol === s.symbol) === i
)

export const DEFAULT_WATCHLIST = [
  ...FX_MAJORS.map(s => s.symbol),
  ...CRYPTO.map(s => s.symbol),
  ...STOCKS.filter(s => ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META'].includes(s.symbol)).map(s => s.symbol),
  ...INDICES.slice(0, 5).map(s => s.symbol),
]

export function findSymbol(sym: string): SymbolDef | undefined {
  const upper = sym.toUpperCase()
  return UNIQUE_SYMBOLS.find(
    s => s.symbol === upper || s.yahooTicker.toUpperCase() === upper || s.display.toUpperCase() === upper
  )
}

export function searchSymbols(query: string): SymbolDef[] {
  const q = query.toUpperCase()
  if (!q) return []
  return UNIQUE_SYMBOLS.filter(
    s =>
      s.symbol.toUpperCase().includes(q) ||
      s.display.toUpperCase().includes(q) ||
      s.category.toUpperCase().includes(q)
  ).slice(0, 10)
}
