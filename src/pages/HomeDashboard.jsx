import React, { useState } from 'react';
import LiveWatchlistBar from '../components/LiveWatchlistBar';
import StockOverviewCard from '../components/StockOverviewCard';
import PriceChartPlaceholder from '../components/PriceChartPlaceholder';
import PredictionCard from '../components/PredictionCard';
import TechnicalIndicatorsCard from '../components/TechnicalIndicatorsCard';
import OptionsBestPremiumEngine from '../components/OptionsBestPremiumEngine';
import OneMonthHighLowRadar from '../components/OneMonthHighLowRadar';
import RealTimeSentimentCard from '../components/RealTimeSentimentCard';
import SentimentPredictionHistory from '../components/SentimentPredictionHistory';
import RecentSearches from '../components/RecentSearches';
import { 
  BarChart2, 
  Flame, 
  Zap, 
  Radio, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HomeDashboard({ 
  currentStock, 
  onSelectStock, 
  allStocks = [],
  tickMeta = {},
  isLiveActive = true,
  onToggleLive,
  recentSearches = [],
  onOpenAnalysisPage
}) {
  // Opening page defaults to 'overview' for clean, instant access to charts and stock details!
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'options' | 'radar' | 'sentiment' | 'history'

  if (!currentStock) return null;

  const currentTick = tickMeta[currentStock.symbol];
  const isRecentTick = currentTick && (Date.now() - currentTick.timestamp < 1200);
  const tickClass = isRecentTick 
    ? (currentTick.direction === 'up' ? 'tick-flash-up' : 'tick-flash-down') 
    : '';

  return (
    <div className="space-y-5 pb-12">
      
      {/* 1. Real-time Lively Watchlist Bar (All stocks with live ticks) */}
      <LiveWatchlistBar
        stocks={allStocks.length > 0 ? allStocks : [currentStock]}
        currentSymbol={currentStock.symbol}
        onSelectStock={onSelectStock}
        tickMeta={tickMeta}
        isLiveActive={isLiveActive}
        onToggleLive={onToggleLive}
      />

      {/* 2. Hero Stock Header: Clear, Prominent, and Simple */}
      <div className={`bg-[#121620] border border-[#232938] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 transition-all ${tickClass}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-[#2b3548] flex items-center justify-center font-mono font-black text-lg text-white shadow-inner">
            {currentStock.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                {currentStock.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#1f2636] text-sky-400 font-mono font-semibold border border-slate-700">
                {currentStock.symbol}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#18202e] text-slate-400 font-mono border border-slate-800">
                {currentStock.exchange} • {currentStock.isIndex ? 'INDEX' : 'EQUITY F&O'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-[#00D09C]">
                <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
                Live Market Streaming
              </span>
              <span>•</span>
              <span>Lot Size: <b className="text-slate-300 font-mono">{currentStock.lotSize || 25}</b></span>
              {currentStock.vix && (
                <>
                  <span>•</span>
                  <span>VIX: <b className="text-sky-300 font-mono">{currentStock.vix}</b></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Price Display & Quick Action */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {currentStock.currency}{Number(currentStock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs sm:text-sm font-mono font-bold flex items-center justify-end gap-1.5 mt-0.5 ${
              currentStock.isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
            }`}>
              {currentStock.isPositive ? (
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{currentStock.change}</span>
              <span>({currentStock.changePercent})</span>
            </div>
          </div>

          <button
            onClick={onOpenAnalysisPage}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all hover:border-sky-500/50"
          >
            <span>Full Analysis</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Clean Navigation Tabs (Simplified & Intuitive) */}
      <div className="flex items-center border-b border-[#232938] pb-1 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a24]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Overview & Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('options')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'options'
              ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a24]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Options Engine</span>
          {currentStock.bestOption && (
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-[#1e2330] text-amber-300 font-mono">
              Premium ₹{currentStock.bestOption.ltp}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'radar'
              ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a24]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>1-Month Breakout Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('sentiment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'sentiment'
              ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a24]'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Market Sentiment</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#00D09C] font-semibold">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161a24]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Prediction History</span>
        </button>
      </div>

      {/* 4. Tab 1: Overview & Chart (DEFAULT: Clean, focused, complete stock details!) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns: Interactive Live Chart + Stock Financials */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Interactive Live Price Chart */}
              <PriceChartPlaceholder stock={currentStock} />

              {/* Comprehensive Key Details Grid & Range Sliders */}
              <StockOverviewCard 
                stock={currentStock} 
                tickInfo={currentTick}
              />
            </div>

            {/* Right 5 Columns: AI Forecast, Technicals, and Options Snapshot */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              {/* AI Forecast & Target Card */}
              <PredictionCard stock={currentStock} />

              {/* Technical Indicators Oscillators */}
              <TechnicalIndicatorsCard stock={currentStock} />

              {/* Quick Best Premium Snapshot */}
              {currentStock.bestOption && (
                <div className="bg-[#121824] rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h3 className="font-bold text-sm text-white">Options Intelligence</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                      {currentStock.bestOption.recommendationStrength || 'STRONG BUY'}
                    </span>
                  </div>

                  <div className="bg-[#0f141f] rounded-xl p-3 border border-slate-800/80 mb-3">
                    <div className="text-xs text-slate-400 mb-1">Recommended Contract</div>
                    <div className="font-mono text-sm font-extrabold text-[#00D09C]">
                      {currentStock.bestOption.recommendedContract}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                      <span>LTP: <b className="text-white">₹{currentStock.bestOption.ltp}</b></span>
                      <span>Target: <b className="text-emerald-400">₹{currentStock.bestOption.target1}</b></span>
                      <span>Stop: <b className="text-rose-400">₹{currentStock.bestOption.stopLoss}</b></span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {currentStock.bestOption.reason}
                  </p>

                  <button
                    onClick={() => setActiveTab('options')}
                    className="w-full py-2.5 rounded-xl bg-[#00D09C]/15 hover:bg-[#00D09C]/25 text-[#00D09C] border border-[#00D09C]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group"
                  >
                    <span>Open Full Options Strategy Engine</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Options & Best Premium Engine */}
      {activeTab === 'options' && (
        <OptionsBestPremiumEngine
          stock={currentStock}
          allStocks={allStocks.length > 0 ? allStocks : [currentStock]}
          onSelectStock={onSelectStock}
        />
      )}

      {/* Tab 3: 1-Month High/Low Radar */}
      {activeTab === 'radar' && (
        <OneMonthHighLowRadar
          allStocks={allStocks.length > 0 ? allStocks : [currentStock]}
          onSelectStock={onSelectStock}
          onSwitchToOptionsTab={() => setActiveTab('options')}
        />
      )}

      {/* Tab 4: Real-Time Public Sentiment */}
      {activeTab === 'sentiment' && (
        <RealTimeSentimentCard
          currentStock={currentStock}
          onSelectStock={onSelectStock}
        />
      )}

      {/* Tab 5: Prediction vs Actual History */}
      {activeTab === 'history' && (
        <SentimentPredictionHistory
          onSelectStock={onSelectStock}
        />
      )}

      {/* Bottom Section: Recent Searches */}
      <div className="mt-8 pt-4 border-t border-[#232938]">
        <RecentSearches 
          recentSymbols={recentSearches}
          onSelectStock={onSelectStock}
          currentSymbol={currentStock.symbol}
        />
      </div>

    </div>
  );
}
