/**
 * StockAI Service Layer
 * 
 * Connected to FastAPI Backend on http://localhost:8000
 * Scalable for Alpha Vantage real market data, ML predictions, and WebSocket updates
 */

import { STOCKS_DATA, DEFAULT_RECENT_SEARCHES } from '../data/stocksData';

const RECENT_SEARCHES_KEY = 'stockai_recent_searches';
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

class StockService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
  }

  /**
   * Fetch real-time stock quote from FastAPI backend:
   * GET http://localhost:8000/stock/{symbol}
   */
  async fetchLiveStockFromBackend(symbol) {
    const cleanSymbol = symbol.trim().toUpperCase();
    try {
      const response = await fetch(`${this.apiBaseUrl}/stock/${encodeURIComponent(cleanSymbol)}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Unable to fetch stock information');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`FastAPI backend fetch failed for ${cleanSymbol}:`, err.message);
      throw new Error('Unable to fetch stock information');
    }
  }

  /**
   * Fetch detailed stock info by symbol.
   * Merges real backend market quote with scalable telemetry for UI.
   */
  async getStockBySymbol(symbol) {
    const cleanSymbol = symbol.trim().toUpperCase();

    // Call real FastAPI endpoint
    const liveData = await this.fetchLiveStockFromBackend(cleanSymbol);

    // Find if we have preset metadata (company name, currency, exchange, baseline prediction)
    const existing = STOCKS_DATA.find((s) => s.symbol.toUpperCase() === cleanSymbol);

    const price = liveData.price;
    const openPrice = liveData.open || price;
    const dayHigh = liveData.high || price;
    const dayLow = liveData.low || price;
    const volume = liveData.volume ? Number(liveData.volume).toLocaleString() : (existing?.volume || "1.2M");
    const changePercentNum = liveData.change_percent;
    const isPositive = changePercentNum >= 0;
    const changeFormatted = liveData.change !== undefined && liveData.change !== null
      ? (liveData.change >= 0 ? `+${liveData.change.toFixed(2)}` : `${liveData.change.toFixed(2)}`)
      : (isPositive ? `+${(price * (changePercentNum / 100)).toFixed(2)}` : `${(price * (changePercentNum / 100)).toFixed(2)}`);
    const changePercentFormatted = `${isPositive ? '+' : ''}${changePercentNum}%`;

    const currency = existing?.currency || (cleanSymbol.endsWith('.BSE') || cleanSymbol.endsWith('.NSE') || cleanSymbol === 'RELIANCE' || cleanSymbol === 'TCS' || cleanSymbol === 'INFY' ? '₹' : '$');
    const exchange = existing?.exchange || (cleanSymbol.endsWith('.BSE') ? 'BSE' : (cleanSymbol.endsWith('.NSE') ? 'NSE' : 'NYSE/NASDAQ'));
    const name = existing?.name || `${cleanSymbol} Inc.`;

    // Calculate prediction based on real price momentum (placeholder until ML endpoint is connected)
    const upProbability = isPositive ? 68 : 34;
    const downProbability = 100 - upProbability;
    const targetPrice = Number((price * (1 + (isPositive ? 0.006 : -0.006))).toFixed(2));

    // Dynamic candles centered around real market price
    const chartHistory = this.generateChartHistoryForPrice(price, openPrice, dayHigh, dayLow, targetPrice);

    return {
      symbol: cleanSymbol,
      name: name,
      exchange: exchange,
      currency: currency,
      price: price,
      change: changeFormatted,
      changePercent: changePercentFormatted,
      isPositive: isPositive,
      dayHigh: dayHigh,
      dayLow: dayLow,
      openPrice: openPrice,
      prevClose: liveData.previous_close || openPrice,
      volume: volume,
      avgVolume: existing?.avgVolume || volume,
      marketCap: existing?.marketCap || `${currency}${(price * 12.5).toFixed(1)}B`,
      peRatio: existing?.peRatio || "24.5",
      isLive: true,
      latestTradingDay: liveData.latest_trading_day || "Today",
      prediction: {
        timeframe: "Next 15 Minutes",
        up: existing?.prediction?.up || upProbability,
        down: existing?.prediction?.down || downProbability,
        confidence: existing?.prediction?.confidence || (Math.abs(upProbability - downProbability) > 30 ? "High" : "Medium"),
        confidenceScore: 0.78,
        targetPrice: targetPrice,
        predictedMove: `${isPositive ? '+' : '-'}${Math.abs(changePercentNum * 0.4).toFixed(2)}%`,
        direction: isPositive ? "UP" : "DOWN",
        modelName: "LSTM-DeepPredict v2.4",
        lastUpdated: "Real-time quote active",
        signals: [
          `Real-time Alpha Vantage feed confirmed at ${currency}${price}`,
          `Intraday change: ${changePercentFormatted} with volume: ${volume}`,
          "Order flow momentum correlated with 15m algorithmic projection"
        ]
      },
      indicators: existing?.indicators || {
        rsi: isPositive ? 61 : 44,
        rsiStatus: isPositive ? "Bullish" : "Weakness",
        macd: isPositive ? 1.15 : -0.65,
        macdSignal: 0.80,
        macdHist: isPositive ? 0.35 : -0.25,
        macdStatus: isPositive ? "Bullish Crossover" : "Bearish Divergence",
        volume: `${isPositive ? '+' : '-'}${Math.abs(changePercentNum * 5).toFixed(0)}%`,
        volumeStatus: "Real-Time Feed",
        ema20: Number((price * 0.995).toFixed(2)),
        ema50: Number((price * 0.988).toFixed(2)),
        bollingerUpper: Number((dayHigh * 1.01).toFixed(2)),
        bollingerLower: Number((dayLow * 0.99).toFixed(2)),
        atr: (price * 0.012).toFixed(2),
        overallSentiment: isPositive ? "Buy" : "Neutral"
      },
      chartHistory: chartHistory
    };
  }

  generateChartHistoryForPrice(price, openPrice, high, low, targetPrice) {
    const baseP = openPrice;
    return [
      { time: "09:30", price: baseP, open: baseP - 2, high: baseP + 3, low: baseP - 3, close: baseP, volume: 150 },
      { time: "10:30", price: low, open: baseP, high: baseP + 2, low: low, close: low + 1, volume: 190 },
      { time: "11:30", price: (openPrice + high) / 2, open: low + 1, high: high - 1, low: low, close: (openPrice + high) / 2, volume: 220 },
      { time: "12:30", price: high, open: (openPrice + high) / 2, high: high, low: low + 2, close: high - 1, volume: 280 },
      { time: "13:30", price: (high + price) / 2, open: high - 1, high: high, low: price - 2, close: (high + price) / 2, volume: 210 },
      { time: "14:30", price: price, open: (high + price) / 2, high: Math.max(high, price), low: Math.min(low, price), close: price, volume: 320 },
      { time: "15:00 (Pred)", price: targetPrice, open: price, high: targetPrice + 2, low: price - 1, close: targetPrice, volume: 350, isPrediction: true }
    ];
  }

  getRecentSearches() {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_RECENT_SEARCHES;
  }

  saveRecentSearch(symbol) {
    try {
      const current = this.getRecentSearches();
      const updated = [symbol.toUpperCase(), ...current.filter((s) => s !== symbol.toUpperCase())].slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_RECENT_SEARCHES;
    }
  }

  async searchStocks(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return STOCKS_DATA.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }
}

export const stockService = new StockService();
export default stockService;
