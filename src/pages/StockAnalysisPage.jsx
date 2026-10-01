import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Target,
  Sparkles,
  Shield,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import PriceChartPlaceholder from '../components/PriceChartPlaceholder';

export default function StockAnalysisPage({ currentStock, onBackToDashboard, onSelectStock }) {
  const [selectedHorizon, setSelectedHorizon] = useState('15m');

  if (!currentStock) return null;

  const { symbol, name, currency, price, changePercent, isPositive, prediction, indicators } = currentStock;

  // Multi-timeframe AI prediction matrix
  const timeframesMatrix = [
    { tf: '5m', up: prediction.up > 60 ? prediction.up - 4 : 52, down: prediction.up > 60 ? 100 - (prediction.up - 4) : 48, confidence: 'Medium', target: (price * 1.002).toFixed(2) },
    { tf: '15m (Active)', up: prediction.up, down: prediction.down, confidence: prediction.confidence, target: prediction.targetPrice || (price * 1.005).toFixed(2) },
    { tf: '30m', up: prediction.up > 55 ? prediction.up + 2 : 46, down: prediction.up > 55 ? 100 - (prediction.up + 2) : 54, confidence: 'High', target: (price * 1.008).toFixed(2) },
    { tf: '1h', up: prediction.up > 50 ? prediction.up - 6 : 41, down: prediction.up > 50 ? 100 - (prediction.up - 6) : 59, confidence: 'Medium', target: (price * 1.012).toFixed(2) },
    { tf: '1D', up: 64, down: 36, confidence: 'High', target: (price * 1.025).toFixed(2) }
  ];

  // Moving average signals
  const movingAverages = [
    { name: 'EMA (10)', value: (price * 0.994).toFixed(2), action: 'BUY', isBuy: true },
    { name: 'EMA (20)', value: indicators.ema20 || (price * 0.991).toFixed(2), action: 'BUY', isBuy: true },
    { name: 'EMA (50)', value: indicators.ema50 || (price * 0.985).toFixed(2), action: 'BUY', isBuy: true },
    { name: 'SMA (20)', value: (price * 0.992).toFixed(2), action: 'BUY', isBuy: true },
    { name: 'SMA (50)', value: (price * 0.982).toFixed(2), action: 'BUY', isBuy: true },
    { name: 'SMA (200)', value: (price * 0.945).toFixed(2), action: 'BUY', isBuy: true }
  ];

  // Oscillators
  const oscillators = [
    { name: 'Relative Strength Index (14)', value: indicators.rsi, status: indicators.rsiStatus, action: indicators.rsi > 50 ? 'BUY' : 'NEUTRAL' },
    { name: 'MACD Level (12, 26)', value: indicators.macd, status: indicators.macdStatus, action: indicators.macd >= 0 ? 'BUY' : 'SELL' },
    { name: 'Stochastic %K (14, 3, 3)', value: '68.4', status: 'Neutral', action: 'NEUTRAL' },
    { name: 'Average Directional Index (14)', value: '31.2', status: 'Trending', action: 'BUY' },
    { name: 'Williams %R (14)', value: '-28.4', status: 'Overbought territory', action: 'SELL' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Back button and page title bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                {symbol} Technical & AI Deep-Dive
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20 font-mono">
                {currentStock.exchange}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive algorithmic signal breakdown, probability distributions, and oscillator analysis.
            </p>
          </div>
        </div>

        {/* Current price quote badge */}
        <div className="text-right">
          <div className="font-mono text-xl sm:text-2xl font-bold text-white">
            {currency}{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {changePercent}
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div>
        <PriceChartPlaceholder stock={currentStock} />
      </div>

      {/* Multi-Horizon Prediction Matrix */}
      <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-base text-white">
              Multi-Horizon AI Forecast Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Model: LSTM-DeepPredict v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {timeframesMatrix.map((item) => (
            <div 
              key={item.tf}
              className={`p-4 rounded-xl border text-center transition-all ${
                item.tf.includes('15m')
                  ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-[#151c2a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-xs font-bold text-slate-300 mb-2">
                {item.tf}
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-emerald-400 font-mono font-extrabold text-xl">
                  {item.up}% <span className="text-[10px] uppercase font-sans">UP</span>
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-rose-400 font-mono font-extrabold text-xl">
                  {item.down}% <span className="text-[10px] uppercase font-sans">DN</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Target: {currency}{item.target}
              </div>
              <div className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block bg-slate-800 text-slate-300 border border-slate-700">
                {item.confidence} Conf.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Moving Averages & Oscillators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Oscillators Table */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Technical Oscillators
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              3 Buy • 1 Neutral • 1 Sell
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {oscillators.map((osc, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-200 font-medium">{osc.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{osc.status}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-300 font-semibold">{osc.value}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    osc.action === 'BUY'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : osc.action === 'SELL'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {osc.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moving Averages Table */}
        <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Moving Averages Trend Alignment
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              6 Bullish Above MA
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {movingAverages.map((ma, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium font-mono">{ma.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-300 font-semibold">
                    {currency}{ma.value}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {ma.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Model Backtest & Reliability Metrics */}
      <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            Model Performance & Backtest Reliability
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-[#151c2a] p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1">Directional Accuracy</div>
            <div className="text-xl font-bold font-mono text-emerald-400">78.4%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Last 500 predictions</div>
          </div>

          <div className="bg-[#151c2a] p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1">Profit Factor</div>
            <div className="text-xl font-bold font-mono text-sky-400">2.18</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Risk-adjusted return</div>
          </div>

          <div className="bg-[#151c2a] p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1">Mean Target Delta</div>
            <div className="text-xl font-bold font-mono text-slate-200">±0.28%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Price deviation bound</div>
          </div>

          <div className="bg-[#151c2a] p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1">Sample Count</div>
            <div className="text-xl font-bold font-mono text-slate-200">12,840</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Total trained candles</div>
          </div>
        </div>
      </div>

    </div>
  );
}
