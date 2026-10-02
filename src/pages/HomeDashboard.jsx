import React, { useState } from 'react';
import GrowwIndicesBanner from '../components/GrowwIndicesBanner';
import OptionsBestPremiumEngine from '../components/OptionsBestPremiumEngine';
import OneMonthHighLowRadar from '../components/OneMonthHighLowRadar';
import RealTimeSentimentCard from '../components/RealTimeSentimentCard';
import SentimentPredictionHistory from '../components/SentimentPredictionHistory';
import StockOverviewCard from '../components/StockOverviewCard';
import PredictionCard from '../components/PredictionCard';
import TechnicalIndicatorsCard from '../components/TechnicalIndicatorsCard';
import PriceChartPlaceholder from '../components/PriceChartPlaceholder';
import RecentSearches from '../components/RecentSearches';
import { MARKET_MOVERS, STOCKS_DATA } from '../data/stocksData';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Activity, 
  Flame, 
  Zap, 
  Radio, 
  Award, 
  BarChart2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function HomeDashboard({ 
  currentStock, 
  onSelectStock, 
  recentSearches = [],
  onOpenAnalysisPage
}) {
  const [activeGrowwTab, setActiveGrowwTab] = useState('options'); // 'options' | 'radar' | 'sentiment' | 'history' | 'overview'

  if (!currentStock) return null;

  const allStocks = STOCKS_DATA;
  const indices = allStocks.filter(s => s.isIndex);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Real-Time Market Ticker Tape */}
      <div className="bg-[#12141a] border-y sm:border sm:rounded-2xl border-[#252a38] px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00D09C] whitespace-nowrap">
          <Activity className="w-3.5 h-3.5" />
          <span>F&O PULSE</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          {MARKET_MOVERS.map((mover) => (
            <button
              key={mover.symbol}
              onClick={() => onSelectStock(mover.symbol)}
              className="flex items-center gap-1.5 hover:text-[#00D09C] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="font-bold text-slate-200">{mover.symbol}</span>
              <span className={`flex items-center text-[11px] font-semibold ${
                mover.isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
              }`}>
                {mover.change}
              </span>
              {mover.tag && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#202534] text-slate-400">
                  {mover.tag}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
          <span>Feed: LIVE Real-Time</span>
        </div>
      </div>

      {/* Prominent SENSEX & NIFTY Groww Header Banner */}
      <GrowwIndicesBanner
        indices={indices}
        currentSymbol={currentStock.symbol}
        onSelectStock={onSelectStock}
      />

      {/* Groww-style Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#252a38] pb-1 overflow-x-auto scrollbar-none gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={() => setActiveGrowwTab('options')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeGrowwTab === 'options'
                ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Options & Best Premium</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-[#1e2330] text-slate-300">
              VIX • Range • Traps
            </span>
          </button>

          <button
            onClick={() => setActiveGrowwTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeGrowwTab === 'radar'
                ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1-Month High & Low Radar</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-[#1e2330] text-slate-300">
              F&O
            </span>
          </button>

          <button
            onClick={() => setActiveGrowwTab('sentiment')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeGrowwTab === 'sentiment'
                ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Real-Time Public Sentiment</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#00D09C]">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveGrowwTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeGrowwTab === 'history'
                ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Prediction vs Actual History</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">
              81.2% Win Rate
            </span>
          </button>

          <button
            onClick={() => setActiveGrowwTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeGrowwTab === 'overview'
                ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Charts & Technicals</span>
          </button>

        </div>
      </div>

      {/* Tab 1: Options & Best Premium Engine */}
      {activeGrowwTab === 'options' && (
        <OptionsBestPremiumEngine
          stock={currentStock}
          allStocks={allStocks}
          onSelectStock={onSelectStock}
        />
      )}

      {/* Tab 2: 1-Month High/Low Radar */}
      {activeGrowwTab === 'radar' && (
        <OneMonthHighLowRadar
          allStocks={allStocks}
          onSelectStock={onSelectStock}
          onSwitchToOptionsTab={() => setActiveGrowwTab('options')}
        />
      )}

      {/* Tab 3: Real-Time Public Sentiment */}
      {activeGrowwTab === 'sentiment' && (
        <RealTimeSentimentCard
          currentStock={currentStock}
          onSelectStock={onSelectStock}
        />
      )}

      {/* Tab 4: Prediction vs Actual History */}
      {activeGrowwTab === 'history' && (
        <SentimentPredictionHistory
          onSelectStock={onSelectStock}
        />
      )}

      {/* Tab 5: Technicals & Charts Grid */}
      {activeGrowwTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <StockOverviewCard stock={currentStock} />
          </div>

          <div className="lg:col-span-8 xl:col-span-6 space-y-6">
            <PriceChartPlaceholder stock={currentStock} />
            <PredictionCard stock={currentStock} />
          </div>

          <div className="lg:col-span-12 xl:col-span-3 space-y-6">
            <TechnicalIndicatorsCard stock={currentStock} />
          </div>
        </div>
      )}

      {/* Bottom Section: Recent Searches */}
      <div className="mt-8 pt-4 border-t border-[#252a38]">
        <RecentSearches 
          recentSymbols={recentSearches}
          onSelectStock={onSelectStock}
          currentSymbol={currentStock.symbol}
        />
      </div>

    </div>
  );
}
