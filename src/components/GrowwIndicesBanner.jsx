import React from 'react';
import { TrendingUp, TrendingDown, Activity, ShieldCheck, ArrowUpRight, Flame, Target } from 'lucide-react';

export default function GrowwIndicesBanner({ indices, currentSymbol, onSelectStock }) {
  if (!indices || indices.length === 0) return null;

  return (
    <div className="w-full">
      {/* Groww Quick Indices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indices.map((index) => {
          const isSelected = currentSymbol === index.symbol;
          const isPos = index.isPositive;

          return (
            <div
              key={index.symbol}
              onClick={() => onSelectStock(index.symbol)}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-[#151c28] border-[#00D09C] shadow-[0_0_20px_rgba(0,208,156,0.15)] ring-1 ring-[#00D09C]/40'
                  : 'bg-[#181a20] hover:bg-[#1f222b] border-[#292d39]'
              }`}
            >
              {/* Active Selection Glow Pill */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#00D09C] text-[#0b0e14] font-bold text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-bl-lg">
                  Active Asset
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {index.name}
                    </h2>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#252834] text-slate-300">
                      {index.exchange}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5 mt-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                      ₹{index.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`flex items-center text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md font-mono ${
                        isPos
                          ? 'bg-[#00D09C]/15 text-[#00D09C]'
                          : 'bg-[#EB5757]/15 text-[#EB5757]'
                      }`}
                    >
                      {isPos ? '+' : ''}{index.change} ({index.changePercent})
                    </span>
                  </div>
                </div>

                {/* Groww Quick Mini-Option Badge */}
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[11px] text-slate-400 font-medium">India VIX</span>
                  <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1 mt-0.5">
                    <Activity className="w-3 h-3" />
                    {index.vix} (Calm)
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">PCR: <b className="text-slate-300">{index.pcr}</b></span>
                </div>
              </div>

              {/* 1-Month Range Mini-Bar */}
              <div className="mt-4 pt-3 border-t border-[#2a2e3a]/70">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                  <span>1M Low: ₹{index.oneMonthLow?.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-semibold text-slate-300">
                    Expected: {index.priceRange?.min?.toLocaleString('en-IN')} - {index.priceRange?.max?.toLocaleString('en-IN')}
                  </span>
                  <span>1M High: ₹{index.oneMonthHigh?.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#262a36] overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-[#00D09C] to-emerald-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          ((index.price - (index.oneMonthLow || index.price * 0.95)) /
                            ((index.oneMonthHigh || index.price * 1.05) - (index.oneMonthLow || index.price * 0.95))) *
                            100,
                          5
                        ),
                        98
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Quick Best Premium Pill */}
              <div className="mt-3 flex items-center justify-between bg-[#12141a] rounded-xl px-3 py-2 border border-[#232733]">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Best Premium: <span className="text-[#00D09C] font-mono">{index.bestOption?.recommendedContract}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    ₹{index.bestOption?.ltp}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#00D09C]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
