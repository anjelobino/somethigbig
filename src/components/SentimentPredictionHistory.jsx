import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Award, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Flame,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { HISTORICAL_PREDICTIONS, PREDICTION_STATS } from '../data/sentimentOptionsData';

export default function SentimentPredictionHistory({ onSelectStock }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'INDICES' | 'FNO' | 'HITS' | 'MISSED'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = HISTORICAL_PREDICTIONS.filter((item) => {
    // Filter by type
    if (filterType === 'INDICES' && !['NIFTY', 'SENSEX'].includes(item.symbol)) return false;
    if (filterType === 'FNO' && ['NIFTY', 'SENSEX'].includes(item.symbol)) return false;
    if (filterType === 'HITS' && item.status !== 'HIT') return false;
    if (filterType === 'MISSED' && item.status !== 'MISSED') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.assetName.toLowerCase().includes(q) ||
        item.predictedSentiment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Top Header: Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#282d39]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00D09C]/15 text-[#00D09C]">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Prediction vs Actual Outcome Audit History
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Verified Audit Log
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking what public sentiment predicted vs what actually materialized in Nifty, Sensex, and F&O stocks with option performance.
          </p>
        </div>

        {/* Win-Rate Pill */}
        <div className="flex items-center gap-3 bg-[#12141a] px-4 py-2 rounded-2xl border border-[#262b37] self-start sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verified Win Rate</span>
            <div className="text-xl font-black text-[#00D09C] font-mono">
              {PREDICTION_STATS.winRatePercent}%
            </div>
          </div>
          <div className="border-l border-[#262b37] pl-3 text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Indices Win Rate</span>
            <div className="text-base font-bold text-sky-400 font-mono">
              {PREDICTION_STATS.indicesAccuracy}
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Total Evaluated
          </span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {PREDICTION_STATS.totalEvaluated}
          </div>
          <span className="text-[10px] text-slate-500">Sensex, Nifty & F&O</span>
        </div>

        <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Accurate Hits
          </span>
          <div className="text-2xl font-black text-[#00D09C] font-mono mt-0.5">
            {PREDICTION_STATS.accurateHits}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">81.25% Hit Ratio</span>
        </div>

        <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Avg Option Gain
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
            {PREDICTION_STATS.averageGainOnRecommendedOption}
          </div>
          <span className="text-[10px] text-slate-500">On Best Premiums</span>
        </div>

        <div className="bg-[#12141a] rounded-xl p-3.5 border border-[#242938]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Missed / Cut
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">
            {PREDICTION_STATS.missed}
          </div>
          <span className="text-[10px] text-rose-400 font-medium">Controlled Risk</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12141a] p-2 rounded-2xl border border-[#262b37]">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'ALL', label: 'All Audits' },
            { id: 'INDICES', label: 'Sensex & Nifty Only' },
            { id: 'FNO', label: 'F&O Stocks Only' },
            { id: 'HITS', label: 'Target Hits Only' },
            { id: 'MISSED', label: 'Missed Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-[#293041] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symbol (e.g. NIFTY)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181d28] border border-[#2c3344] text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#00D09C]"
          />
        </div>
      </div>

      {/* Verification Audit Cards / Table */}
      <div className="space-y-3.5">
        {filteredHistory.map((item) => {
          const isHit = item.status === 'HIT';
          const isPartial = item.status === 'PARTIAL';
          const isMissed = item.status === 'MISSED';

          return (
            <div
              key={item.id}
              className="bg-[#12141a] hover:bg-[#161922] border border-[#242938] hover:border-[#384155] rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md"
            >
              {/* Row 1: Asset, Time, Verification Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[#202534]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectStock && onSelectStock(item.symbol)}
                    className="font-bold text-base text-white font-mono hover:text-[#00D09C] transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.symbol}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <span className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-none">
                    {item.assetName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">• {item.timestamp}</span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Accuracy: <b className="text-white">{item.accuracyScore}%</b>
                  </span>
                  {isHit ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PREDICTION HIT
                    </span>
                  ) : isPartial ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <AlertCircle className="w-3.5 h-3.5" />
                      PARTIAL TARGET
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5" />
                      MISSED / STOPPED
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Comparison Grid: Predicted vs Actually Happened */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#161a24] rounded-xl p-3.5 border border-[#232838] mb-3">
                {/* Predicted Column */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block mb-1">
                    What Sentiment Predicted:
                  </span>
                  <div className="text-sm font-bold text-white font-mono">
                    {item.predictedSentiment}
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    Target: ₹{item.predictedTarget.toLocaleString('en-IN')} ({item.predictedMove})
                  </div>
                </div>

                {/* Actually Happened Column */}
                <div className="border-t sm:border-t-0 sm:border-l border-[#262c3e] pt-2 sm:pt-0 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-[#00D09C] tracking-wider block mb-1">
                    Actually What Happened:
                  </span>
                  <div className="text-sm font-bold text-white font-mono">
                    Price Reached: ₹{item.actualPriceReached.toLocaleString('en-IN')}
                  </div>
                  <div className={`text-xs font-bold font-mono mt-0.5 ${item.actualMove.startsWith('+') ? 'text-[#00D09C]' : 'text-rose-400'}`}>
                    Actual Move: {item.actualMove} ({item.timeHorizon})
                  </div>
                </div>
              </div>

              {/* Row 3: Driver Rationale & Recommended Option Outcome */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-300 leading-relaxed max-w-xl">
                  <span className="font-semibold text-slate-200">Analytical Driver:</span> {item.driverReason}
                </div>

                <div className="bg-[#1e2330] rounded-lg px-2.5 py-1.5 border border-[#2c3344] whitespace-nowrap self-start sm:self-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Recommended Option:</span>
                  <span className="font-mono text-xs font-bold text-[#00D09C]">
                    {item.recommendedOptionWas}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
