/**
 * StockAI Service Layer
 * 
 * Powered by LiveMarketEngine for lively real-time ticks across all stocks and indices,
 * with background FastAPI sync when backend is running.
 */

import { DEFAULT_RECENT_SEARCHES } from '../data/stocksData';
import { HISTORICAL_PREDICTIONS, PREDICTION_STATS, INITIAL_SENTIMENT_FEED, calculateOptionsIntelligence } from '../data/sentimentOptionsData';
import liveMarketEngine from './liveMarketEngine';

const RECENT_SEARCHES_KEY = 'stockai_recent_searches';
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

class StockService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
  }

  /**
   * Fetch real-time stock quote from FastAPI backend if available
   */
  async fetchLiveStockFromBackend(symbol) {
    const cleanSymbol = symbol.trim().toUpperCase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s fast timeout

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
    } catch {
      // Backend unavailable or timed out, falls back gracefully without disturbance
      return null;
    }
  }

  /**
   * Get detailed stock info by symbol instantly from live market engine.
   * Runs backend sync asynchronously in background without blocking UI.
   */
  async getStockBySymbol(symbol) {
    const cleanSymbol = (symbol || 'NIFTY').trim().toUpperCase();
    liveMarketEngine.setActiveSymbol(cleanSymbol);

    // Get current live stock state immediately
    const stock = liveMarketEngine.getStock(cleanSymbol);

    // Try backend sync asynchronously in the background
    this.fetchLiveStockFromBackend(cleanSymbol).then((liveBackendData) => {
      if (liveBackendData && liveBackendData.price) {
        liveMarketEngine.updateStockFromBackend(cleanSymbol, liveBackendData);
      }
    }).catch(() => {});

    // Ensure calculated options intelligence is attached
    if (!stock.calculatedIntel) {
      stock.calculatedIntel = calculateOptionsIntelligence(stock, stock.vix || 13.65);
    }

    return stock;
  }

  /**
   * Get all live stocks and indices
   */
  getAllStocks() {
    return liveMarketEngine.getAllStocks();
  }

  /**
   * Get indices specifically (NIFTY 50, SENSEX)
   */
  getIndices() {
    return liveMarketEngine.getAllStocks().filter((s) => s.isIndex);
  }

  /**
   * Get F&O stocks classified by 1-Month High and 1-Month Low
   */
  getOneMonthHighLowStocks() {
    const stocks = liveMarketEngine.getAllStocks();
    const highBreakouts = stocks.filter(
      (s) => !s.isIndex && (s.breakout?.status === 'BREAKOUT_CONFIRMED' || s.breakout?.status === 'NEAR_1M_HIGH')
    );

    const lowBreakdowns = stocks.filter(
      (s) => !s.isIndex && (s.breakout?.status === 'FALSE_BREAKDOWN_ALERT' || s.breakout?.status === 'SUPPORT_BOUNCE' || s.breakout?.status === 'NEAR_1M_LOW')
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
    const all = liveMarketEngine.getAllStocks();
    return all.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }
}

export const stockService = new StockService();
export default stockService;
