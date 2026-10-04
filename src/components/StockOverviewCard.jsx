import React from 'react';
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Activity,
  Layers,
  BarChart3,
  Flame,
  Target
} from 'lucide-react';

export default function StockOverviewCard({ stock, tickInfo = null }) {
  if (!stock) return null;

  const isUp = stock.isPositive;
  const dayRangeSpread = (stock.dayHigh || stock.price) - (stock.dayLow || stock.price);
  const currentPos = dayRangeSpread > 0 
    ? Math.min(100, Math.max(0, ((stock.price - (stock.dayLow || stock.price)) / dayRangeSpread) * 100))
    : 50;

  const oneMonthSpread = (stock.oneMonthHigh || stock.price * 1.05) - (stock.oneMonthLow || stock.price * 0.95);
  const oneMonthPos = oneMonthSpread > 0
    ? Math.min(100, Math.max(0, ((stock.price - (stock.oneMonthLow || stock.price * 0.95)) / oneMonthSpread) * 100))
    : 50;

  const isRecentTick = tickInfo && (Date.now() - tickInfo.timestamp < 1200);
  const tickClass = isRecentTick 
    ? (tickInfo.direction === 'up' ? 'tick-flash-up' : 'tick-flash-down') 
    : '';

  return (
    <div className={`bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden transition-all ${tickClass}`}>
      {/* Background ambient glow matching price momentum */}
      <div 
        className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none ${
          isUp ? 'bg-[#00D09C]' : 'bg-[#EB5757]'
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
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50 font-mono">
              {stock.isIndex ? 'BENCHMARK INDEX' : 'EQUITY F&O'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            {stock.name}
          </p>
        </div>

        {/* Live Market Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00D09C]/10 border border-[#00D09C]/25 text-[#00D09C] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
          <span className="font-mono text-[11px]">LIVE (NSE)</span>
        </div>
      </div>

      {/* Main Price & Daily Change Display */}
      <div className="flex items-baseline justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="text-[11px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">Current Market Price</div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 tracking-tight flex items-baseline">
            <span className="text-slate-400 text-2xl font-semibold mr-1">{stock.currency}</span>
            {Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Change Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold font-mono shadow-sm ${
          isUp 
            ? 'bg-[#00D09C]/10 border-[#00D09C]/30 text-[#00D09C]' 
            : 'bg-[#EB5757]/10 border-[#EB5757]/30 text-[#EB5757]'
        }`}>
          {isUp ? (
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>{stock.change}</span>
          <span className="opacity-80">({stock.changePercent})</span>
        </div>
      </div>

      {/* Today's Range Slider */}
      <div className="mb-4 bg-[#0f141f] rounded-xl p-3 border border-slate-800/70">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
          <span>Day Low: <span className="font-mono text-slate-300 font-semibold">{stock.currency}{Number(stock.dayLow || stock.price).toLocaleString('en-IN')}</span></span>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Today's Range</span>
          <span>Day High: <span className="font-mono text-slate-300 font-semibold">{stock.currency}{Number(stock.dayHigh || stock.price).toLocaleString('en-IN')}</span></span>
        </div>
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-rose-500/60 via-amber-500/60 to-emerald-500/80 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
        <div className="relative w-full h-1 mt-1">
          <div 
            className="absolute -top-3 w-2.5 h-2.5 bg-sky-400 border-2 border-white rounded-full shadow-md -ml-1 transition-all duration-300"
            style={{ left: `${currentPos}%` }}
            title={`Current: ${stock.currency}${stock.price}`}
          />
        </div>
      </div>

      {/* 1-Month Range Slider */}
      {stock.oneMonthHigh && stock.oneMonthLow && (
        <div className="mb-4 bg-[#0f141f] rounded-xl p-3 border border-slate-800/70">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
            <span>1M Low: <span className="font-mono text-slate-300 font-semibold">{stock.currency}{Number(stock.oneMonthLow).toLocaleString('en-IN')}</span></span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">1-Month Breakout Band</span>
            <span>1M High: <span className="font-mono text-slate-300 font-semibold">{stock.currency}{Number(stock.oneMonthHigh).toLocaleString('en-IN')}</span></span>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-[#00D09C] rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div className="relative w-full h-1 mt-1">
            <div 
              className="absolute -top-3 w-2.5 h-2.5 bg-[#00D09C] border-2 border-white rounded-full shadow-md -ml-1 transition-all duration-300"
              style={{ left: `${oneMonthPos}%` }}
              title={`Position in 1M Range: ${oneMonthPos.toFixed(1)}%`}
            />
          </div>
        </div>
      )}

      {/* Financial Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Open Price</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.currency}{Number(stock.openPrice || stock.price).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Prev Close</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.currency}{Number(stock.prevClose || stock.price).toLocaleString('en-IN')}
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
            {stock.marketCap || '—'}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">P/E Ratio</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.peRatio || '—'}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">VWAP</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.vwap ? `${stock.currency}${Number(stock.vwap).toLocaleString('en-IN')}` : '—'}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Put-Call Ratio</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.pcr || '1.12'}
          </div>
        </div>

        <div className="bg-[#151c2a] p-2.5 rounded-xl border border-slate-800/75">
          <div className="text-slate-400 font-medium text-[11px]">Lot Size</div>
          <div className="font-mono text-slate-200 font-semibold mt-0.5">
            {stock.lotSize ? `${stock.lotSize} Qty` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
