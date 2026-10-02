import React from 'react';
import { 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  Activity, 
  Sparkles, 
  BarChart2, 
  LayoutDashboard,
  Flame,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenSettings,
  currentStock 
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252a38] bg-[#12141a]/95 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-[#00D09C] to-teal-400 flex items-center justify-center shadow-lg shadow-[#00D09C]/20 group-hover:scale-105 transition-transform duration-200">
              <TrendingUp className="w-5 h-5 text-[#0b0e14] stroke-[2.8]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-[#00D09C] transition-colors">
                  Groww<span className="text-[#00D09C]">Sentiment</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/20 font-mono">
                  Options AI
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Groww Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'analysis'
                  ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181a20]'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Deep Analysis
            </button>
          </nav>
        </div>

        {/* Center: Search Trigger Button for quick access */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#181a20] border border-[#2a2f3e] hover:border-[#00D09C]/50 text-slate-400 hover:text-slate-200 transition-all text-sm group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#00D09C] transition-colors" />
              <span>Search NIFTY, SENSEX, or F&O stocks (e.g. TATAMOTORS)...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-[#252a38] text-slate-400 border border-[#343b4d]">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Live Market Status & Settings */}
        <div className="flex items-center gap-3">
          {/* Live Market Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20 text-[#00D09C] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
            <span>LIVE DERIVATIVES</span>
          </div>

          {/* Quick search button for mobile */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg bg-[#181a20] text-slate-300 hover:text-white border border-[#2a2f3e]"
            title="Search Stocks"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Settings / Configuration button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-[#181a20] hover:bg-[#202430] border border-[#2a2f3e] text-slate-300 hover:text-white transition-all text-sm font-semibold shadow-sm hover:border-[#3a4254]"
            title="Prediction & Dashboard Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#00D09C]" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* User profile avatar badge */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#242a38] to-[#1a1e28] border border-[#303749] flex items-center justify-center font-bold text-xs text-[#00D09C] shadow-md">
            GW
          </div>
        </div>

      </div>
    </header>
  );
}
