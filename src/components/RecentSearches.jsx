import React from 'react';
import { Clock, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { STOCKS_DATA } from '../data/stocksData';

export default function RecentSearches({ 
  recentSymbols = [], 
  onSelectStock, 
  currentSymbol 
}) {
  if (!recentSymbols || recentSymbols.length === 0) return null;

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>Recently Viewed Stocks</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {recentSymbols.length} cached
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {recentSymbols.map((sym) => {
          const stock = STOCKS_DATA.find((s) => s.symbol === sym) || {
            symbol: sym,
            price: 1500,
            currency: '₹',
            changePercent: '+0.5%',
            isPositive: true
          };
          const isSelected = currentSymbol === sym;

          return (
            <button
              key={sym}
              onClick={() => onSelectStock(sym)}
              className={`p-3 rounded-xl border text-left transition-all group relative overflow-hidden ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500/50 shadow-md shadow-sky-500/10'
                  : 'bg-[#151c2a] border-slate-800 hover:border-slate-700 hover:bg-[#1a2334]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-sm font-bold ${
                  isSelected ? 'text-sky-300' : 'text-slate-100 group-hover:text-sky-400'
                }`}>
                  {stock.symbol}
                </span>
                <span className={`text-[11px] font-mono font-semibold flex items-center gap-0.5 ${
                  stock.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {stock.isPositive ? (
                    <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                  )}
                  {stock.changePercent}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>{stock.currency}{stock.price.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300">
                  Select →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
