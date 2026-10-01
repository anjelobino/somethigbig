import React from 'react';
import StockOverviewCard from '../components/StockOverviewCard';
import PredictionCard from '../components/PredictionCard';
import TechnicalIndicatorsCard from '../components/TechnicalIndicatorsCard';
import PriceChartPlaceholder from '../components/PriceChartPlaceholder';
import RecentSearches from '../components/RecentSearches';
import StockSearchBar from '../components/StockSearchBar';
import { MARKET_MOVERS } from '../data/stocksData';
import { TrendingUp, TrendingDown, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function HomeDashboard({ 
  currentStock, 
  onSelectStock, 
  recentSearches = [],
  onOpenAnalysisPage
}) {
  if (!currentStock) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Market Ticker Tape */}
      <div className="bg-[#0e1420] border-y sm:border sm:rounded-2xl border-slate-800/80 px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 whitespace-nowrap">
          <Activity className="w-3.5 h-3.5" />
          <span>MARKET TICKER</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          {MARKET_MOVERS.map((mover) => (
            <button
              key={mover.symbol}
              onClick={() => onSelectStock(mover.symbol)}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="font-bold text-slate-200">{mover.symbol}</span>
              <span className={`flex items-center text-[11px] font-semibold ${
                mover.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {mover.isPositive ? '+' : ''}{mover.change}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Feed: LIVE 15m Candles</span>
        </div>
      </div>

      {/* Main 3-Column TradingView Finance Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (lg: 3.5 cols): Selected stock information, price, daily change %, stats */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <StockOverviewCard stock={currentStock} />

          {/* Quick AI Summary Signal */}
          <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                AI Health Consensus
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Bullish Drift
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consensus derived from deep learning transformer processing order-book depth and momentum indicators.
            </p>
          </div>
        </div>

        {/* Center Column (lg: 5.5 cols): Main Chart Placeholder + Primary Prediction Card */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-6">
          {/* Price Chart Placeholder */}
          <PriceChartPlaceholder stock={currentStock} />

          {/* Centerpiece: Next 15 Minutes Prediction Card */}
          <PredictionCard stock={currentStock} />
        </div>

        {/* Right Column (lg: 3 cols): Technical indicators (RSI, MACD, Volume) */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-6">
          <TechnicalIndicatorsCard stock={currentStock} />
        </div>

      </div>

      {/* Bottom Section: Recent Searches section */}
      <div className="mt-8">
        <RecentSearches 
          recentSymbols={recentSearches}
          onSelectStock={onSelectStock}
          currentSymbol={currentStock.symbol}
        />
      </div>

    </div>
  );
}
