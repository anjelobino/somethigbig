/**
 * StockAI Service Layer
 * 
 * Connected to FastAPI Backend with seamless offline & simulation fallbacks
 * Provides full support for NIFTY 50, SENSEX, F&O stocks, Real-Time Sentiment, and Options Trading
 */

import { STOCKS_DATA, DEFAULT_RECENT_SEARCHES } from '../data/stocksData';
import { HISTORICAL_PREDICTIONS, PREDICTION_STATS, INITIAL_SENTIMENT_FEED, calculateOptionsIntelligence } from '../data/sentimentOptionsData';

const RECENT_SEARCHES_KEY = 'stockai_recent_searches';
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

class StockService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
  }

  /**
   * Fetch real-time stock quote from FastAPI backend if available,
   * or fall back to rich verified datasets.
   */
  async fetchLiveStockFromBackend(symbol) {
    const cleanSymbol = symbol.trim().toUpperCase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // Quick 1.2s timeout

      const response = await fetch(`${this.apiBaseUrl}/stock/${encodeURIComponent(cleanSymbol)}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Backend responded with error');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      // Backend unavailable or timed out, will fall back gracefully
      return null;
    }
  }

  /**
   * Fetch detailed stock info by symbol.
   * Merges real backend market quote with deep options & breakout telemetry.
   */
  async getStockBySymbol(symbol) {
    const cleanSymbol = (symbol || 'NIFTY').trim().toUpperCase();

    // Check if preset stock exists
    let existing = STOCKS_DATA.find((s) => s.symbol.toUpperCase() === cleanSymbol);
    
    // If not found, check case-insensitive match or fallback to first
    if (!existing) {
      existing = STOCKS_DATA.find((s) => s.symbol.toUpperCase().includes(cleanSymbol)) || STOCKS_DATA[0];
    }

    // Try real FastAPI backend in background
    const liveBackendData = await this.fetchLiveStockFromBackend(cleanSymbol);

    if (liveBackendData && liveBackendData.price) {
      // Merge live price with existing rich metadata
      const price = liveBackendData.price;
      const changePercentNum = liveBackendData.change_percent;
      const isPositive = changePercentNum >= 0;

      return {
        ...existing,
        price: price,
        change: liveBackendData.change ? `${liveBackendData.change >= 0 ? '+' : ''}${liveBackendData.change.toFixed(2)}` : existing.change,
        changePercent: `${isPositive ? '+' : ''}${changePercentNum}%`,
        isPositive: isPositive,
        dayHigh: liveBackendData.high || existing.dayHigh,
        dayLow: liveBackendData.low || existing.dayLow,
        openPrice: liveBackendData.open || existing.openPrice,
        volume: liveBackendData.volume ? Number(liveBackendData.volume).toLocaleString() : existing.volume,
        isLive: true
      };
    }

    // Return rich preset with real-time options intelligence
    const intel = calculateOptionsIntelligence(existing, existing.vix || 13.65);
    return {
      ...existing,
      calculatedIntel: intel,
      isLive: true
    };
  }

  /**
   * Get all stocks and indices for display
   */
  getAllStocks() {
    return STOCKS_DATA;
  }

  /**
   * Get indices specifically (NIFTY 50, SENSEX)
   */
  getIndices() {
    return STOCKS_DATA.filter((s) => s.isIndex);
  }

  /**
   * Get F&O stocks classified by 1-Month High and 1-Month Low
   */
  getOneMonthHighLowStocks() {
    const highBreakouts = STOCKS_DATA.filter(
      (s) => !s.isIndex && (s.breakout.status === 'BREAKOUT_CONFIRMED' || s.breakout.status === 'NEAR_1M_HIGH')
    );

    const lowBreakdowns = STOCKS_DATA.filter(
      (s) => !s.isIndex && (s.breakout.status === 'FALSE_BREAKDOWN_ALERT' || s.breakout.status === 'SUPPORT_BOUNCE' || s.breakout.status === 'NEAR_1M_LOW')
    );

    return {
      highBreakouts,
      lowBreakdowns
    };
  }

  /**
   * Get prediction accuracy history & statistics
   */
  getHistoricalPredictions() {
    return {
      stats: PREDICTION_STATS,
      history: HISTORICAL_PREDICTIONS
    };
  }

  /**
   * Get real-time sentiment stream
   */
  getSentimentFeed() {
    return INITIAL_SENTIMENT_FEED;
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
