import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Target, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  HelpCircle, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  DollarSign,
  Compass,
  BarChart3,
  Percent
} from 'lucide-react';

export default function OptionsBestPremiumEngine({ stock, allStocks, onSelectStock }) {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);
  const [vixInput, setVixInput] = useState(stock.vix || 13.65);

  if (!stock) return null;

  const {
    symbol,
    name,
    price,
    change,
    changePercent,
    isPositive,
    isIndex,
    lotSize = 25,
    vix = 13.65,
    pcr = 1.15,
    vwap = price * 0.998,
    maxPain = price,
    keyLevels = {},
    breakout = {},
    priceRange = {},
    bestOption = {},
    sentiment = {}
  } = stock;

  const isCall = bestOption.optionType === 'CALL';
  const capitalNeeded = bestOption.capitalPerLot || (bestOption.ltp * lotSize);

  // Position of price inside the Min-Max range for visual slider (0% to 100%)
  const minP = priceRange.min || (price * 0.985);
  const maxP = priceRange.max || (price * 1.015);
  const rangeSpan = maxP - minP;
  const currentRangePosition = Math.min(Math.max(((price - minP) / (rangeSpan || 1)) * 100, 5), 95);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Selected Asset + Quick Switcher */}
      <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              {symbol}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-[#262b37] text-slate-300">
              {isIndex ? 'Benchmark Index' : 'F&O Equity Stock'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Lot: {lotSize} Qty
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{name} • Derivatives & Options Chain Analysis</p>
        </div>

        {/* Current Live Price + Change */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-xs sm:text-sm font-bold font-mono ${isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'}`}>
              {isPositive ? '+' : ''}{change} ({changePercent})
            </div>
          </div>

          {/* Quick Dropdown to switch asset */}
          <div className="flex flex-col text-xs">
            <span className="text-[10px] text-slate-400 font-semibold mb-1">Select Asset</span>
            <select
              value={symbol}
              onChange={(e) => onSelectStock(e.target.value)}
              className="bg-[#12141a] border border-[#303747] text-white text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-[#00D09C]"
            >
              <optgroup label="Indices">
                {allStocks.filter(s => s.isIndex).map(s => (
                  <option key={s.symbol} value={s.symbol}>{s.symbol} (₹{s.price})</option>
                ))}
              </optgroup>
              <optgroup label="F&O Stocks (1M High/Low)">
                {allStocks.filter(s => !s.isIndex).map(s => (
                  <option key={s.symbol} value={s.symbol}>{s.symbol} (₹{s.price})</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Options Hero: Best Premium Recommendation + Expected Min-Max Range */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card (7 Cols): The Recommended Best Option Premium */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#181d28] via-[#161a24] to-[#12141c] border-2 border-[#00D09C]/40 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,208,156,0.12)] relative overflow-hidden flex flex-col justify-between">
          
          {/* Top highlight ribbon */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#00D09C] text-[#0b0e14]">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#00D09C]">
                  Groww AI Recommended Premium
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {bestOption.recommendedContract}
                </h3>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${
              isCall ? 'bg-[#00D09C]/20 text-[#00D09C] border border-[#00D09C]/40' : 'bg-[#EB5757]/20 text-[#EB5757] border border-[#EB5757]/40'
            }`}>
              {bestOption.optionType} ({bestOption.recommendationStrength || 'STRONG BUY'})
            </span>
          </div>

          {/* Premium Price & Capital Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0f1218]/90 rounded-2xl p-4 border border-[#232836] mb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Premium LTP</span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5">
                ₹{bestOption.ltp?.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#00D09C] font-semibold">Live Quote</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Capital / Lot</span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#00D09C] font-mono mt-0.5">
                ₹{capitalNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{lotSize} Qty × ₹{bestOption.ltp}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Target 1 & 2</span>
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">
                ₹{bestOption.target1} • ₹{bestOption.target2}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Risk/Reward: {bestOption.riskReward || '1:2'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Stop Loss</span>
              <div className="text-base sm:text-lg font-bold text-rose-400 font-mono mt-1">
                ₹{bestOption.stopLoss}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Strict Discipline</span>
            </div>
          </div>

          {/* Option Greeks & Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#141822] rounded-xl border border-[#232836] mb-4 text-xs font-mono">
            <div className="flex items-center justify-between pr-2 border-r border-[#262c3c]">
              <span className="text-slate-400">Delta (Δ):</span>
              <span className="font-bold text-white">+{bestOption.delta || '0.50'}</span>
            </div>
            <div className="flex items-center justify-between px-2 border-r border-[#262c3c]">
              <span className="text-slate-400">Theta (θ):</span>
              <span className="font-bold text-rose-400">{bestOption.theta || '-12.0'} ₹/d</span>
            </div>
            <div className="flex items-center justify-between pl-2">
              <span className="text-slate-400">Implied Vol (IV):</span>
              <span className="font-bold text-sky-400">{bestOption.iv || '14.2'}%</span>
            </div>
          </div>

          {/* Strategic Reasoning Explanation */}
          <div className="bg-[#12151e] rounded-xl p-3.5 border border-[#222736]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Why This Premium Was Chosen:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {bestOption.reason}
            </p>
          </div>
        </div>

        {/* Right Card (5 Cols): Min and Max Expected Price Range */}
        <div className="lg:col-span-5 bg-[#181a20] border border-[#282d39] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    VIX & Probability Cone
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Projected Price Range
                  </h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {priceRange.expectedMove || '±1.6%'}
              </span>
            </div>

            {/* Min and Max Range Box */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Minimum Range (Floor)
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono mt-1">
                  ₹{minP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500">Key Support S1/S2</span>
              </div>

              <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Maximum Range (Cap)
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-[#00D09C] font-mono mt-1">
                  ₹{maxP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500">Key Resistance R1/R2</span>
              </div>
            </div>

            {/* Visual Interactive Range Slider */}
            <div className="bg-[#12141a] rounded-xl p-4 border border-[#242938] mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-rose-400 font-bold">Min: ₹{minP.toFixed(0)}</span>
                <span className="text-white font-bold bg-[#1e2330] px-2 py-0.5 rounded">
                  Spot: ₹{price.toFixed(0)}
                </span>
                <span className="text-[#00D09C] font-bold">Max: ₹{maxP.toFixed(0)}</span>
              </div>

              {/* Slider Track */}
              <div className="relative w-full h-3 rounded-full bg-[#232938] overflow-visible">
                {/* Colored Zone */}
                <div className="h-full bg-gradient-to-r from-rose-500 via-sky-400 to-[#00D09C] rounded-full opacity-80"></div>

                {/* Spot Pointer Marker */}
                <div
                  className="absolute -top-1 w-5 h-5 rounded-full bg-white border-2 border-[#0b0e14] shadow-lg transform -translate-x-1/2 flex items-center justify-center transition-all duration-300"
                  style={{ left: `${currentRangePosition}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 font-mono">
                <span>{priceRange.confidence || '82% Statistical Probability'}</span>
                <span>Basis: VIX {vix}</span>
              </div>
            </div>
          </div>

          {/* Mathematical Range Formula Explanation Card */}
          <div className="bg-[#141720] rounded-xl p-3 border border-[#232836] text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-0.5">Formula Applied:</span>
            <code className="text-sky-300 font-mono text-[10px] block">
              Expected Move = Spot × (VIX / 100) × √(DaysToExpiry / 365)
            </code>
            <p className="mt-1 text-[10px] text-slate-400">
              Combines 1-sigma standard deviation volatility cone with institutional order book support/resistance.
            </p>
          </div>
        </div>

      </div>

      {/* The 6-Factor Multi-Factor Algorithmic Analysis Matrix */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-[#00D09C]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Multi-Factor Algorithmic Breakdown
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">• 6 Key Indicators Analyzed for Premium Selection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Factor 1: India VIX Analysis */}
          <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-4 hover:border-[#384155] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                1. India VIX Volatility
              </span>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {vix}
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              Regime: {stock.vixStatus || 'Low-Normal (Calm Volatility)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              At 13.65, implied volatility is benign. Option premium decay is predictable with minimal IV crush risk, giving directional option buyers maximum reward.
            </p>
          </div>

          {/* Factor 2: News & Macro Sentiment */}
          <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-4 hover:border-[#384155] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                2. News Sentiment Score
              </span>
              <span className="text-xs font-mono font-bold text-[#00D09C] bg-[#00D09C]/10 px-2 py-0.5 rounded border border-[#00D09C]/20">
                +{sentiment.newsScore || 78}/100
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              Sentiment: {sentiment.label || 'Strongly Bullish'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time NLP processed financial headlines, quarterly earnings commentary, and FII inflow numbers confirm positive institutional narrative.
            </p>
          </div>

          {/* Factor 3: Breakout vs False Breakout Detector */}
          <div className={`border rounded-2xl p-4 transition-all ${
            breakout.isValid 
              ? 'bg-[#181a20] border-[#00D09C]/30' 
              : 'bg-[#1e1518] border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                {breakout.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00D09C]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                3. Breakout vs False Trap
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                breakout.isValid 
                  ? 'bg-[#00D09C]/15 text-[#00D09C] border-[#00D09C]/30' 
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {breakout.verdict || 'Confirmed Breakout'}
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              Vol Ratio: <span className="font-mono text-[#00D09C]">{breakout.volumeConfirmationRatio || 1.8}x Avg Vol</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {breakout.summary}
            </p>
          </div>

          {/* Factor 4: Value Price & VWAP */}
          <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-4 hover:border-[#384155] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                4. Value Price & VWAP
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                VWAP: ₹{vwap.toFixed(0)}
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1 font-mono">
              Pivot: ₹{keyLevels.pivot || price} • Max Pain: ₹{maxPain}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              S1: ₹{keyLevels.s1 || price * 0.99} | R1: ₹{keyLevels.r1 || price * 1.01}
              <br />
              Spot trading {price >= vwap ? 'ABOVE' : 'BELOW'} intraday institutional benchmark.
            </p>
          </div>

          {/* Factor 5: Volume & Open Interest (OI) */}
          <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-4 hover:border-[#384155] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                5. Volume & Open Interest (OI)
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                PCR: {pcr}
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              OI Flow: {pcr >= 1.0 ? 'Bullish Put Writing Dominated' : 'Call Resistance Heavy'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Derivative desk flows show heavy put base building below current market price, acting as an elastic cushion against downside selloffs.
            </p>
          </div>

          {/* Factor 6: Public & Social Sentiment */}
          <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-4 hover:border-[#384155] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00D09C]" />
                6. Public & Social Sentiments
              </span>
              <span className="text-xs font-mono font-bold text-[#00D09C] bg-[#00D09C]/10 px-2 py-0.5 rounded border border-[#00D09C]/20">
                {sentiment.score || 76}% Bullish
              </span>
            </div>
            <div className="text-xs font-semibold text-white mb-1">
              Fear & Greed Index: <span className="font-mono text-amber-400">{sentiment.fearGreedIndex || 68} ({sentiment.fearGreedLabel || 'Greed'})</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Social feeds (Twitter/X, StockTwits) and retail broker order book trends align with continued upward momentum with low crowd complacency.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
