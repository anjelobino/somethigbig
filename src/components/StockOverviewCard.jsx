import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe2, 
  Info,
  Clock
} from 'lucide-react';

export default function StockOverviewCard({ stock }) {
  if (!stock) return null;

  const isUp = stock.isPositive;
  const dayRangeSpread = stock.dayHigh - stock.dayLow;
  const currentPos = dayRangeSpread > 0 
    ? Math.min(100, Math.max(0, ((stock.price - stock.dayLow) / dayRangeSpread) * 100))
    : 50;

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient glow matching price momentum */}
      <div 
        className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none ${
          isUp ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      {/* Header: Symbol, Name & Exchange */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              {stock.symbol}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 font-semibold border border-slate-700 font-mono">
              {stock.exchange}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
              EQUITY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            {stock.name}
          </p>
        </div>

        {/* Live Market Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-mono text-slate-400">15m Interval</span>
        </div>
      </div>

      {/* Main Price & Daily Change Display */}
      <div className="flex items-baseline justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-slate-400 font-medium mb-0.5">Current Stock Price</div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 tracking-tight flex items-baseline">
            <span className="text-slate-400 text-2xl font-semibold mr-1">{stock.currency}</span>
            {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Change Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold font-mono shadow-sm ${
          isUp 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {isUp ? (
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>{stock.change}</span>
          <span className="opacity-75">({stock.changePercent})</span>
        </div>
      </div>

      {/* Day's Range Slider */}
      <div className="mb-5 bg-[#0f141f] rounded-xl p-3 border border-slate-800/70">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
          <span>Day Low: <span className="font-mono text-slate-300">{stock.currency}{stock.dayLow}</span></span>
          <span className="text-[11px] text-slate-500 font-mono">Today's Range</span>
          <span>Day High: <span className="font-mono text-slate-300">{stock.currency}{stock.dayHigh}</span></span>
        </div>
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-rose-500/50 via-amber-500/50 to-emerald-500/70 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
        <div className="relative w-full h-1 mt-1">
          <div 
            className="absolute -top-3 w-2.5 h-2.5 bg-sky-400 border border-white rounded-full shadow-md -ml-1 transition-all duration-300"
            style={{ left: `${currentPos}%` }}
            title={`Current: ${stock.currency}${stock.price}`}
          />
        </div>
      </div>

      {/* Financial Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Open Price</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.currency}{stock.openPrice?.toLocaleString() || stock.price}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Prev Close</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.currency}{stock.prevClose?.toLocaleString() || stock.price}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Volume</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.volume}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Market Cap</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.marketCap}
          </div>
        </div>
      </div>
    </div>
  );
}
