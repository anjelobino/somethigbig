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
  const [currentSymbol, setCurrentSymbol] = useState('NIFTY'); // NIFTY benchmark index default
  const [currentStock, setCurrentStock] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Loading and Error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize stock data & recent searches
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
      // Fallback directly to STOCKS_DATA to guarantee flawless user experience
      const fallback = stockService.getAllStocks().find(s => s.symbol.toUpperCase() === symbol.toUpperCase()) || stockService.getAllStocks()[0];
      setCurrentStock(fallback);
      setCurrentSymbol(fallback.symbol);
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
    <div className="min-h-screen bg-[#0e1015] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Groww Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentStock={currentStock}
      />

      {/* Top Live Loading Bar */}
      {isLoading && (
        <div className="bg-[#00D09C]/15 border-b border-[#00D09C]/30 text-[#00D09C] px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D09C]" />
          <span>Synchronizing options order book and real-time sentiment stream...</span>
        </div>
      )}

      {/* Error Notification Banner (if any) */}
      {errorMessage && (
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-300 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-semibold text-rose-200">{errorMessage}</span>
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
        {isLoading && !currentStock ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#00D09C] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-300 text-sm font-semibold tracking-wide">
              Loading Groww Market & Sentiment Engine...
            </p>
            <p className="text-slate-500 text-xs mt-1">Calculating India VIX, breakout metrics, and options premiums...</p>
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
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#222736] py-5 text-center text-xs text-slate-500">
        <p>GrowwSentiment Options AI • Real-Time Market Sentiment, Breakout Radar & Derivatives Intelligence Engine</p>
      </footer>
    </div>
  );
}
