import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Layers, 
  ArrowRight
} from 'lucide-react';

export default function OneMonthHighLowRadar({ allStocks, onSelectStock, onSwitchToOptionsTab }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'LOW'

  // Filter only F&O stocks (exclude indices from this specific radar view)
  const fnoStocks = allStocks.filter((s) => !s.isIndex);

  const highBreakoutStocks = fnoStocks.filter(
    (s) => s.breakout?.status === 'BREAKOUT_CONFIRMED' || s.breakout?.status === 'NEAR_1M_HIGH'
  );

  const lowBreakdownStocks = fnoStocks.filter(
    (s) => s.breakout?.status === 'FALSE_BREAKDOWN_ALERT' || s.breakout?.status === 'SUPPORT_BOUNCE' || s.breakout?.status === 'NEAR_1M_LOW'
  );

  const displayedStocks = filter === 'HIGH' 
    ? highBreakoutStocks 
    : filter === 'LOW' 
    ? lowBreakdownStocks 
    : fnoStocks;

  const handleStockAction = (symbol) => {
    onSelectStock(symbol);
    if (onSwitchToOptionsTab) {
      onSwitchToOptionsTab();
    }
  };

  return (
    <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header with Title & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#282d39]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00D09C]/15 text-[#00D09C]">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              1-Month High & Low F&O Radar
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#242936] text-slate-300 border border-[#343b4d]">
              Options Trading
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time screening of F&O contracts touching 30-day highs or lows, cross-checked for genuine volume breakouts vs false traps.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#12141a] p-1 rounded-xl border border-[#262b37] self-start sm:self-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-[#293041] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Highlighted ({fnoStocks.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filter === 'HIGH'
                ? 'bg-[#00D09C]/20 text-[#00D09C] border border-[#00D09C]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Near 1M High ({highBreakoutStocks.length})
          </button>
          <button
            onClick={() => setFilter('LOW')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filter === 'LOW'
                ? 'bg-[#EB5757]/20 text-[#EB5757] border border-[#EB5757]/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Near 1M Low ({lowBreakdownStocks.length})
          </button>
        </div>
      </div>

      {/* Grid of Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {displayedStocks.map((stock) => {
          const isHighCandidate = stock.breakout?.status === 'BREAKOUT_CONFIRMED' || stock.breakout?.status === 'NEAR_1M_HIGH';
          const isFalseTrap = stock.breakout?.status === 'FALSE_BREAKDOWN_ALERT';
          const isBounce = stock.breakout?.status === 'SUPPORT_BOUNCE';
          const isPos = stock.isPositive;

          // Distance calculations
          const distHigh = stock.oneMonthHigh ? Math.abs(((stock.oneMonthHigh - stock.price) / stock.price) * 100).toFixed(1) : '1.2';
          const distLow = stock.oneMonthLow ? Math.abs(((stock.price - stock.oneMonthLow) / stock.price) * 100).toFixed(1) : '0.8';

          return (
            <div
              key={stock.symbol}
              className="bg-[#12141a] hover:bg-[#161922] border border-[#262b37] hover:border-[#384155] rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-md"
            >
              <div>
                {/* Top Badge: Breakout Verdict */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white tracking-tight group-hover:text-[#00D09C] transition-colors">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-[#1e232f]">
                      Lot: {stock.lotSize}
                    </span>
                  </div>

                  {/* Status Tag */}
                  {isHighCandidate ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {stock.breakout?.status === 'BREAKOUT_CONFIRMED' ? '1M Breakout' : 'Near 1M High'}
                    </span>
                  ) : isFalseTrap ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      False Breakdown Trap
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      <TrendingUp className="w-3 h-3" />
                      1M Support Bounce
                    </span>
                  )}
                </div>

                {/* Stock Name & Price Row */}
                <p className="text-xs text-slate-400 truncate mb-2">{stock.name}</p>

                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-white font-mono">
                      ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs font-bold font-mono ${isPos ? 'text-[#00D09C]' : 'text-[#EB5757]'}`}>
                      {stock.changePercent}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Vol: <b className="text-slate-200">{stock.breakout?.volumeConfirmationRatio || 1.4}x</b>
                  </span>
                </div>

                {/* 1-Month Range Visual Tracker */}
                <div className="bg-[#191d27] rounded-xl p-2.5 mb-3 border border-[#242938]">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>1M Low: ₹{stock.oneMonthLow}</span>
                    <span>1M High: ₹{stock.oneMonthHigh}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#272e3d] overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${
                        isHighCandidate ? 'bg-[#00D09C]' : isFalseTrap ? 'bg-amber-400' : 'bg-sky-400'
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(
                            ((stock.price - stock.oneMonthLow) / (stock.oneMonthHigh - stock.oneMonthLow)) * 100,
                            8
                          ),
                          96
                        )}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                    <span>
                      {isHighCandidate ? `${distHigh}% from 1M High` : `${distLow}% from 1M Low`}
                    </span>
                    <span className="text-slate-300 font-semibold">
                      Range: ₹{stock.priceRange?.min} - ₹{stock.priceRange?.max}
                    </span>
                  </div>
                </div>

                {/* Algorithmic Reason Summary */}
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {stock.breakout?.summary}
                </p>
              </div>

              {/* Action Button: Best Option Strike Preview & Select */}
              <div className="pt-3 border-t border-[#252a38]">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-slate-400">Best Option:</span>
                  <span className="font-mono font-bold text-[#00D09C]">
                    {stock.bestOption?.recommendedContract}
                  </span>
                </div>

                <button
                  onClick={() => handleStockAction(stock.symbol)}
                  className="w-full py-2 px-3 rounded-xl bg-[#00D09C]/10 hover:bg-[#00D09C] text-[#00D09C] hover:text-[#0b0e14] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 border border-[#00D09C]/30 hover:border-[#00D09C] cursor-pointer"
                >
                  <span>Select & Analyze Best Premium</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
