import React from 'react';
import { TrendingUp, TrendingDown, Radio, Play, Pause, ChevronRight } from 'lucide-react';

export default function LiveWatchlistBar({ 
  stocks = [], 
  currentSymbol, 
  onSelectStock, 
  tickMeta = {}, 
  isLiveActive = true,
  onToggleLive 
}) {
  return (
    <div className="w-full bg-[#12141a] border border-[#252a38] rounded-2xl p-2.5 sm:p-3 shadow-lg">
      {/* Top micro-bar: Live status & Market timing */}
      <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#1f2430] text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/30 text-[#00D09C] font-semibold text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-[#00D09C] animate-ping' : 'bg-slate-500'}`}></span>
            <span>{isLiveActive ? 'LIVE NSE/BSE TICKER' : 'PAUSED'}</span>
          </div>
          <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
            Exchange Feed • Real-Time Order Flow
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              isLiveActive 
                ? 'bg-[#181d27] hover:bg-[#202735] text-slate-300 border-[#2c3345]' 
                : 'bg-[#00D09C]/20 hover:bg-[#00D09C]/30 text-[#00D09C] border-[#00D09C]/40'
            }`}
            title={isLiveActive ? 'Pause real-time ticks' : 'Resume real-time ticks'}
          >
            {isLiveActive ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#00D09C]" />
                <span>Resume Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal scrolling strip of all lively stocks */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {stocks.map((stock) => {
          const isSelected = stock.symbol.toUpperCase() === (currentSymbol || '').toUpperCase();
          const tickInfo = tickMeta[stock.symbol];
          const isRecentTick = tickInfo && (Date.now() - tickInfo.timestamp < 1200);
          const tickClass = isRecentTick 
            ? (tickInfo.direction === 'up' ? 'tick-flash-up' : 'tick-flash-down') 
            : '';

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectStock(stock.symbol)}
              className={`flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 border text-left cursor-pointer group ${
                isSelected
                  ? 'bg-[#192231] border-[#00D09C] shadow-[0_0_12px_rgba(0,208,156,0.18)] ring-1 ring-[#00D09C]/50'
                  : 'bg-[#161821] hover:bg-[#1d212c] border-[#262b3a]'
              } ${tickClass}`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-xs font-bold tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {stock.symbol}
                  </span>
                  {stock.isIndex && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#252834] text-sky-400 font-mono font-semibold">
                      INDEX
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[85px] leading-tight">
                  {stock.name.replace(' Index', '')}
                </div>
              </div>

              <div className="text-right">
                <div className={`font-mono text-xs font-extrabold tracking-tight transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-100'
                }`}>
                  ₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                  stock.isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
                }`}>
                  {stock.isPositive ? '+' : ''}{stock.changePercent}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
