import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight, Zap } from 'lucide-react';
import stockService from '../services/stockService';

export default function StockSearchBar({ 
  onSelectStock, 
  recentSearches = [], 
  isOpen = false, 
  onClose = null,
  isModal = false 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen || !isModal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isModal]);

  // Handle live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayTimer = setTimeout(async () => {
      try {
        const matches = await stockService.searchStocks(query);
        setResults(matches);
      } catch (err) {
        console.error('Error searching stocks:', err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(delayTimer);
  }, [query]);

  const handleSelect = (symbol) => {
    onSelectStock(symbol);
    setQuery('');
    setResults([]);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
    if (e.key === 'Enter' && query.trim()) {
      const topMatch = results[0]?.symbol || query.trim();
      handleSelect(topMatch);
    }
  };

  const popularSymbols = ["RELIANCE", "NVDA", "TCS", "TSLA", "AAPL", "INFY"];

  const content = (
    <div className="w-full bg-[#121824] rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden">
      {/* Input row */}
      <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800">
        <Search className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by stock symbol or company name (e.g. RELIANCE, NVDA)..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm md:text-base font-medium focus:outline-none"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isModal && (
          <button 
            onClick={onClose}
            className="ml-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 border border-slate-700"
          >
            ESC
          </button>
        )}
      </div>

      {/* Popular quick-select pills */}
      <div className="px-4 py-2.5 bg-[#0f141d] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Trending:
        </span>
        {popularSymbols.map((sym) => (
          <button
            key={sym}
            onClick={() => handleSelect(sym)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/40 border border-slate-700 text-slate-300 font-mono transition-all font-semibold"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Results Dropdown or Suggestions */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2">
        {isLoading && (
          <div className="p-6 text-center text-sm text-slate-400">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Searching market data...
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-slate-300 text-sm font-medium">No preset match for "{query}"</p>
            <p className="text-xs text-slate-500 mt-1">Press Enter to simulate AI prediction for ticker: <span className="font-mono text-sky-400 font-bold">{query.toUpperCase()}</span></p>
            <button
              onClick={() => handleSelect(query)}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              Analyze {query.toUpperCase()} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div>
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Matched Stocks ({results.length})
            </div>
            {results.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-sky-400 group-hover:border-sky-500/50">
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 group-hover:text-sky-300 font-mono">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {stock.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold font-mono text-slate-100">
                    {stock.currency}{stock.price.toLocaleString()}
                  </div>
                  <div className={`text-xs font-mono font-medium flex items-center justify-end gap-1 ${
                    stock.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {stock.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stock.changePercent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Recent Searches if no active query */}
        {!query && recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-500" />
                Recent Searches
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
              {recentSearches.map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleSelect(sym)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-left"
                >
                  <span className="font-mono text-xs font-bold text-slate-200">{sym}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
        <div className="fixed inset-0" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
