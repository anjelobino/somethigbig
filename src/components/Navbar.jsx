import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Settings, 
  SlidersHorizontal, 
  Activity, 
  Sparkles, 
  BarChart2, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenSettings,
  currentStock 
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2937]/80 bg-[#0d121c]/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Stock<span className="text-sky-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  ML 2.4
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Home Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Stock Analysis
            </button>
          </nav>
        </div>

        {/* Center: Search Trigger Button for quick access */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#141b27] border border-slate-700/60 hover:border-sky-500/50 text-slate-400 hover:text-slate-200 transition-all text-sm group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
              <span>Search stocks (e.g. RELIANCE, NVDA, TCS)...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Live Market Status & Settings */}
        <div className="flex items-center gap-3">
          {/* Live Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 soft-pulse"></span>
            <span>MARKET LIVE</span>
          </div>

          {/* Quick search button for mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
            title="Search Stocks"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Settings / Configuration button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-[#161d2b] hover:bg-[#1f283b] border border-slate-700/80 text-slate-300 hover:text-white transition-all text-sm font-medium shadow-sm hover:border-slate-600"
            title="Prediction & Dashboard Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* User profile avatar placeholder */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-xs text-sky-300 shadow-md">
            AI
          </div>
        </div>

      </div>
    </header>
  );
}
