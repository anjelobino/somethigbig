// Real-time Live Market Engine
// Simulates lively exchange order book ticks for Indian Equities and Indices (NSE & BSE)
// Provides instant reactive updates, micro-ticks, visual flash feedback, and live chart syncing

import { STOCKS_DATA } from '../data/stocksData';

class LiveMarketEngine {
  constructor() {
    this.stocks = JSON.parse(JSON.stringify(STOCKS_DATA));
    this.activeSymbol = 'NIFTY';
    this.listeners = new Set();
    this.timer = null;
    this.isRunning = true;
    this.tickMeta = {}; // { [symbol]: { direction: 'up' | 'down', timestamp: number } }

    this.start();
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.tick();
    }, 2200);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.notify();
  }

  toggleLive() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  setActiveSymbol(symbol) {
    if (!symbol) return;
    this.activeSymbol = symbol.toUpperCase();
    // Immediate micro-tick on active symbol to provide instant feedback
    this.tickSymbol(this.activeSymbol);
  }

  tickSymbol(symbol) {
    const stockIndex = this.stocks.findIndex(
      (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
    );
    if (stockIndex === -1) return;

    const stock = this.stocks[stockIndex];
    const isIndex = stock.isIndex;

    // Realistic volatility: indices move slightly smaller percentage than equities
    const maxMovePct = isIndex ? 0.0006 : 0.0016; // 0.06% vs 0.16%
    const directionWeight = stock.prediction?.direction === 'UP' ? 0.54 : 0.46;
    const isUp = Math.random() < directionWeight;
    const deltaPct = (Math.random() * maxMovePct) * (isUp ? 1 : -1);

    const oldPrice = stock.price;
    let newPrice = Number((oldPrice * (1 + deltaPct)).toFixed(2));
    if (newPrice <= 0) newPrice = oldPrice;

    // Minimum tick constraint for NSE/BSE (0.05 min tick size)
    if (Math.abs(newPrice - oldPrice) < 0.05) {
      newPrice = Number((oldPrice + (isUp ? 0.05 : -0.05)).toFixed(2));
    }

    const prevClose = stock.prevClose || (oldPrice * 0.995);
    const diff = Number((newPrice - prevClose).toFixed(2));
    const pct = Number(((diff / prevClose) * 100).toFixed(2));
    const isPositive = diff >= 0;

    // Update Day High / Low
    const dayHigh = Math.max(stock.dayHigh || newPrice, newPrice);
    const dayLow = Math.min(stock.dayLow || newPrice, newPrice);

    // Increment volume realistically
    let currentVolNum = 1200000;
    if (typeof stock.volume === 'string') {
      if (stock.volume.endsWith('M')) {
        currentVolNum = parseFloat(stock.volume) * 1000000;
      } else if (stock.volume.endsWith('K')) {
        currentVolNum = parseFloat(stock.volume) * 1000;
      } else {
        currentVolNum = parseFloat(stock.volume.replace(/,/g, '')) || 1200000;
      }
    }
    const newVolNum = currentVolNum + Math.floor(Math.random() * 3200 + 400);
    const formattedVolume = newVolNum >= 1000000 
      ? `${(newVolNum / 1000000).toFixed(1)}M` 
      : `${Math.round(newVolNum / 1000)}K`;

    // Sync live point into chartHistory
    let updatedChartHistory = [...(stock.chartHistory || [])];
    if (updatedChartHistory.length > 0) {
      const lastIndex = updatedChartHistory.length - 1;
      const lastCandle = { ...updatedChartHistory[lastIndex] };

      lastCandle.close = newPrice;
      lastCandle.price = newPrice;
      lastCandle.high = Math.max(lastCandle.high || newPrice, newPrice);
      lastCandle.low = Math.min(lastCandle.low || newPrice, newPrice);
      lastCandle.volume = (lastCandle.volume || 100) + Math.floor(Math.random() * 5 + 1);

      updatedChartHistory[lastIndex] = lastCandle;
    }

    // Save tick metadata for UI flash highlight
    this.tickMeta[stock.symbol] = {
      direction: newPrice >= oldPrice ? 'up' : 'down',
      timestamp: Date.now()
    };

    // Update stock in array
    this.stocks[stockIndex] = {
      ...stock,
      price: newPrice,
      change: `${isPositive ? '+' : ''}${diff.toFixed(2)}`,
      changePercent: `${isPositive ? '+' : ''}${pct.toFixed(2)}%`,
      isPositive: isPositive,
      dayHigh: dayHigh,
      dayLow: dayLow,
      volume: formattedVolume,
      chartHistory: updatedChartHistory,
      lastTickTime: Date.now()
    };
  }

  tick() {
    if (!this.isRunning) return;

    // Pick 2-4 random stocks to tick + the active stock
    const symbolsToTick = new Set([this.activeSymbol]);
    const numRandom = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numRandom; i++) {
      const randIdx = Math.floor(Math.random() * this.stocks.length);
      symbolsToTick.add(this.stocks[randIdx].symbol);
    }

    symbolsToTick.forEach((sym) => {
      this.tickSymbol(sym);
    });

    this.notify();
  }

  updateStockFromBackend(symbol, backendData) {
    if (!backendData || !backendData.price) return;
    const stockIndex = this.stocks.findIndex(
      (s) => s.symbol.toUpperCase() === symbol.toUpperCase()
    );
    if (stockIndex === -1) return;

    const stock = this.stocks[stockIndex];
    const newPrice = backendData.price;
    const isUp = backendData.change_percent >= 0;

    this.tickMeta[stock.symbol] = {
      direction: isUp ? 'up' : 'down',
      timestamp: Date.now()
    };

    this.stocks[stockIndex] = {
      ...stock,
      price: newPrice,
      change: backendData.change 
        ? `${backendData.change >= 0 ? '+' : ''}${backendData.change.toFixed(2)}` 
        : stock.change,
      changePercent: `${isUp ? '+' : ''}${backendData.change_percent}%`,
      isPositive: isUp,
      dayHigh: backendData.high || stock.dayHigh,
      dayLow: backendData.low || stock.dayLow,
      volume: backendData.volume ? Number(backendData.volume).toLocaleString() : stock.volume,
      isLive: true
    };

    this.notify();
  }

  getAllStocks() {
    return [...this.stocks];
  }

  getStock(symbol) {
    const clean = (symbol || 'NIFTY').toUpperCase().trim();
    return (
      this.stocks.find((s) => s.symbol.toUpperCase() === clean) ||
      this.stocks.find((s) => s.symbol.toUpperCase().includes(clean)) ||
      this.stocks[0]
    );
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const all = this.getAllStocks();
    const active = this.getStock(this.activeSymbol);
    this.listeners.forEach((listener) => {
      try {
        listener(all, active, this.tickMeta, this.isRunning);
      } catch (err) {
        console.error('Error in live market listener:', err);
      }
    });
  }
}

export const liveMarketEngine = new LiveMarketEngine();
export default liveMarketEngine;
