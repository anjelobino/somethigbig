import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockSearchBar from './components/StockSearchBar';
import SettingsModal from './components/SettingsModal';
import HomeDashboard from './pages/HomeDashboard';
import StockAnalysisPage from './pages/StockAnalysisPage';
import stockService from './services/stockService';
import { TrendingUp, AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'analysis'
  const [currentSymbol, setCurrentSymbol] = useState('RELIANCE');
  const [currentStock, setCurrentStock] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Requirement 7: Explicit Loading and Error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize stock data & recent searches from backend
  useEffect(() => {
    loadStock(currentSymbol);
  }, []);

  const loadStock = async (symbol) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const stock = await stockService.getStockBySymbol(symbol);
      setCurrentStock(stock);
      setCurrentSymbol(stock.symbol);
      
      const updatedRecents = stockService.saveRecentSearch(stock.symbol);
      setRecentSearches(updatedRecents);
    } catch (err) {
      console.error(`Error loading stock ${symbol}:`, err);
      // Requirement 7: Exact error state text
      setErrorMessage("Unable to fetch stock information");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stock selection
  const handleSelectStock = (symbol) => {
    loadStock(symbol);
  };

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentStock={currentStock}
      />

      {/* Top Live Loading Bar (Requirement 7) */}
      {isLoading && (
        <div className="bg-sky-500/15 border-b border-sky-500/30 text-sky-400 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
          <span>Fetching market data...</span>
        </div>
      )}

      {/* Error Notification Banner (Requirement 7) */}
      {errorMessage && (
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-300 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-semibold text-rose-200">{errorMessage}</span>
              <span className="hidden sm:inline text-rose-400/80">• Check symbol or try again</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadStock(currentSymbol)}
                className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-mono text-[11px]"
              >
                Retry
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded hover:bg-rose-500/20 text-rose-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Full-screen Loading State when initial load has no stock data */}
        {isLoading && !currentStock ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-300 text-sm font-semibold tracking-wide">
              Fetching market data...
            </p>
            <p className="text-slate-500 text-xs mt-1">Connecting to FastAPI & Alpha Vantage feed...</p>
          </div>
        ) : !currentStock && errorMessage ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-12 h-12 text-rose-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Unable to fetch stock information
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm">
              The Alpha Vantage market data could not be retrieved. Please check backend connection or retry with another stock.
            </p>
            <button
              onClick={() => loadStock('RELIANCE')}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs"
            >
              Reset to RELIANCE
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' ? (
              <HomeDashboard
                currentStock={currentStock}
                onSelectStock={handleSelectStock}
                recentSearches={recentSearches}
                onOpenAnalysisPage={() => setActiveTab('analysis')}
              />
            ) : (
              <StockAnalysisPage
                currentStock={currentStock}
                onBackToDashboard={() => setActiveTab('dashboard')}
                onSelectStock={handleSelectStock}
              />
            )}
          </>
        )}
      </main>

      {/* Search Modal Overlay */}
      <StockSearchBar
        isModal={true}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={handleSelectStock}
        recentSearches={recentSearches}
      />

      {/* Settings & Backend Config Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* TradingView-style Minimal Financial Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d121c] py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>StockAI</span>
            </div>
            <span>•</span>
            <span>Real-time Alpha Vantage Data via Python FastAPI</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              FastAPI: http://localhost:8000
            </span>
            <span className="hidden sm:inline">Frontend & Backend Fully Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
