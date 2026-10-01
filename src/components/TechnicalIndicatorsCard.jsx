import React from 'react';
import { 
  Activity, 
  BarChart2, 
  Gauge, 
  Zap, 
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';

export default function TechnicalIndicatorsCard({ stock }) {
  if (!stock || !stock.indicators) return null;

  const { 
    rsi = 62, 
    rsiStatus = "Bullish",
    macd = 1.25, 
    macdSignal = 0.85,
    macdHist = 0.40,
    macdStatus = "Bullish Crossover",
    volume = "+12%", 
    volumeStatus = "Above Average",
    ema20,
    ema50,
    bollingerUpper,
    bollingerLower,
    overallSentiment = "Buy"
  } = stock.indicators;

  // Determine RSI zone
  const getRsiColor = (val) => {
    if (val >= 70) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (val <= 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
  };

  // Determine Sentiment badge
  const sentimentStyles = {
    'Strong Buy': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Buy': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Neutral': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Sell': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    'Strong Sell': 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Technical Indicators
            </h3>
            <p className="text-[11px] text-slate-400">
              TradingView-style real-time oscillators
            </p>
          </div>
        </div>

        {/* Overall Sentiment Meter Badge */}
        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
          sentimentStyles[overallSentiment] || sentimentStyles['Buy']
        }`}>
          {overallSentiment}
        </div>
      </div>

      {/* Main 3 Requested Indicators */}
      <div className="space-y-4 mb-5">
        
        {/* RSI Box */}
        <div className="bg-[#0f141f] rounded-xl p-3.5 border border-slate-800/70 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              RSI (14)
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded font-medium border ${getRsiColor(rsi)}`}>
                {rsiStatus}
              </span>
              <span className="font-mono text-base font-bold text-slate-100">
                {rsi}
              </span>
            </div>
          </div>

          {/* RSI Gauge Bar with 30 and 70 marker pins */}
          <div className="relative w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
            {/* Zones: <30 Oversold (green), 30-70 Neutral (blue), >70 Overbought (red) */}
            <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-emerald-500/30" />
            <div className="absolute left-[30%] top-0 bottom-0 w-[40%] bg-sky-500/30" />
            <div className="absolute left-[70%] top-0 bottom-0 w-[30%] bg-rose-500/30" />
            {/* Value Pointer */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-md"
              style={{ left: `${Math.min(100, Math.max(0, rsi))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Oversold (30)</span>
            <span>Neutral (50)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        {/* MACD Box */}
        <div className="bg-[#0f141f] rounded-xl p-3.5 border border-slate-800/70 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              MACD (12, 26, 9)
            </span>
            <span className="font-mono text-base font-bold text-slate-100">
              {macd > 0 ? `+${macd}` : macd}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              Signal: <span className="text-slate-300 font-semibold">{macdSignal}</span>
            </span>
            <span className="flex items-center gap-1">
              Hist: <span className={macdHist >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                {macdHist >= 0 ? `+${macdHist}` : macdHist}
              </span>
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              macdHist >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}>
              {macdStatus}
            </span>
          </div>
        </div>

        {/* Volume Box */}
        <div className="bg-[#0f141f] rounded-xl p-3.5 border border-slate-800/70 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              Volume Surge
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                {volumeStatus}
              </span>
              <span className={`font-mono text-base font-bold ${
                volume.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {volume}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Compared to 20-session average volume baseline
          </div>
        </div>

      </div>

      {/* Additional Key Technical Levels */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          Trend & Volatility Filters
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800/80 flex justify-between">
            <span className="text-slate-400">EMA 20</span>
            <span className="text-slate-200 font-semibold">{ema20 ? `${stock.currency}${ema20}` : '—'}</span>
          </div>
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800/80 flex justify-between">
            <span className="text-slate-400">EMA 50</span>
            <span className="text-slate-200 font-semibold">{ema50 ? `${stock.currency}${ema50}` : '—'}</span>
          </div>
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800/80 flex justify-between">
            <span className="text-slate-400">Upper Band</span>
            <span className="text-emerald-400 font-semibold">{bollingerUpper ? `${stock.currency}${bollingerUpper}` : '—'}</span>
          </div>
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800/80 flex justify-between">
            <span className="text-slate-400">Lower Band</span>
            <span className="text-rose-400 font-semibold">{bollingerLower ? `${stock.currency}${bollingerLower}` : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
