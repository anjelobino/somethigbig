import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  HelpCircle, 
  Cpu, 
  Clock, 
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function PredictionCard({ stock }) {
  if (!stock || !stock.prediction) return null;

  const { symbol, currency } = stock;
  const { 
    timeframe = "Next 15 Minutes", 
    up = 72, 
    down = 28, 
    confidence = "Medium", 
    confidenceScore = 0.76,
    targetPrice,
    predictedMove,
    modelName = "LSTM-DeepPredict v2.4",
    lastUpdated = "Just now",
    signals = []
  } = stock.prediction;

  const isUpDominant = up >= down;

  // Confidence badge color mapping
  const confidenceStyles = {
    High: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      dot: "bg-emerald-400"
    },
    Medium: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      text: "text-amber-400",
      dot: "bg-amber-400"
    },
    Low: {
      bg: "bg-slate-500/15",
      border: "border-slate-500/30",
      text: "text-slate-400",
      dot: "bg-slate-400"
    }
  };

  const currentConf = confidenceStyles[confidence] || confidenceStyles.Medium;

  return (
    <div className="bg-[#121824] rounded-2xl border border-sky-500/25 p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative top accent line with animated gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500" />
      
      {/* Subtle radial background glow */}
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <span>AI Forecast</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-sky-400 font-bold">{symbol}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {timeframe} Prediction
            </h3>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Confidence
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${currentConf.bg} ${currentConf.border} ${currentConf.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentConf.dot}`}></span>
            {confidence}
          </div>
        </div>
      </div>

      {/* Primary Probability Display: UP vs DOWN Cards */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        
        {/* UP Box */}
        <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
          isUpDominant 
            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/40' 
            : 'bg-[#151c2a] border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
              UP
            </span>
            {isUpDominant && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FAVORED
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
            {up}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Prob. of upward move
          </div>
        </div>

        {/* DOWN Box */}
        <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
          !isUpDominant 
            ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/40' 
            : 'bg-[#151c2a] border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
              DOWN
            </span>
            {!isUpDominant && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                FAVORED
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400 tracking-tight">
            {down}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Prob. of downward move
          </div>
        </div>

      </div>

      {/* Visual Probability Balance Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs font-mono font-medium text-slate-400 mb-1.5">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Bullish {up}%
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            Bearish {down}%
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${up}%` }}
          />
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-r-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${down}%` }}
          />
        </div>
      </div>

      {/* Projected Target Box */}
      {targetPrice && (
        <div className="p-3 bg-[#0d121c] rounded-xl border border-slate-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Projected 15m Target</div>
              <div className="font-mono font-bold text-sm text-slate-100">
                {currency}{targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          {predictedMove && (
            <div className={`font-mono text-xs font-bold px-2 py-1 rounded-md ${
              predictedMove.startsWith('+') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {predictedMove}
            </div>
          )}
        </div>
      )}

      {/* Key AI Model Signals */}
      {signals && signals.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center justify-between">
            <span>Model Rationale</span>
            <span className="font-mono text-[10px] text-slate-500 font-normal">
              {modelName}
            </span>
          </div>
          <ul className="space-y-1.5">
            {signals.map((signal, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-sky-400 mt-0.5">•</span>
                <span className="leading-relaxed">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-400" />
          Updated: {lastUpdated}
        </span>
        <span className="text-slate-400">
          Confidence Score: <span className="text-slate-300 font-semibold">{(confidenceScore * 100).toFixed(0)}%</span>
        </span>
      </div>
    </div>
  );
}
