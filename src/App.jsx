import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockSearchBar from './components/StockSearchBar';
import SettingsModal from './components/SettingsModal';
import HomeDashboard from './pages/HomeDashboard';
import StockAnalysisPage from './pages/StockAnalysisPage';
import stockService from './services/stockService';
import liveMarketEngine from './services/liveMarketEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'analysis'
  const [currentSymbol, setCurrentSymbol] = useState('NIFTY'); // NIFTY benchmark index default
  
  // Initialize synchronously with liveMarketEngine for instant, zero-delay rendering
  const [allStocks, setAllStocks] = useState(() => liveMarketEngine.getAllStocks());
  const [currentStock, setCurrentStock] = useState(() => liveMarketEngine.getStock('NIFTY'));
  const [tickMeta, setTickMeta] = useState({});
  const [isLiveActive, setIsLiveActive] = useState(true);

  const [recentSearches, setRecentSearches] = useState(() => stockService.getRecentSearches());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Subscribe to real-time live market ticks across ALL stocks
  useEffect(() => {
    // Set initial active symbol
    liveMarketEngine.setActiveSymbol(currentSymbol);

    const unsubscribe = liveMarketEngine.subscribe(
      (updatedStocks, updatedActiveStock, updatedTickMeta, isLiveRunning) => {
        setAllStocks(updatedStocks);
        setTickMeta({ ...updatedTickMeta });
        setIsLiveActive(isLiveRunning);

        if (updatedActiveStock) {
          setCurrentStock(updatedActiveStock);
        }
      }
    );

    // Initial background sync check with backend
    stockService.getStockBySymbol(currentSymbol);

    return () => unsubscribe();
  }, []);

  // Handle stock selection seamlessly
  const handleSelectStock = async (symbol) => {
    const clean = symbol.toUpperCase().trim();
    setCurrentSymbol(clean);
    liveMarketEngine.setActiveSymbol(clean);

    const stock = await stockService.getStockBySymbol(clean);
    setCurrentStock(stock);

    const updatedRecents = stockService.saveRecentSearch(clean);
    setRecentSearches(updatedRecents);
  };

  const handleToggleLive = () => {
    const running = liveMarketEngine.toggleLive();
    setIsLiveActive(running);
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

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'dashboard' ? (
          <HomeDashboard
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
            allStocks={allStocks}
            tickMeta={tickMeta}
            isLiveActive={isLiveActive}
            onToggleLive={handleToggleLive}
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
      </main>

      {/* Search Modal Overlay */}
      <StockSearchBar
        isModal={true}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={handleSelectStock}
        recentSearches={recentSearches}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#1e2330] py-5 text-center text-xs text-slate-500">
        <p>GrowwSentiment Options AI • Real-Time Market Ticker, Options Intelligence & Breakout Radar</p>
      </footer>
    </div>
  );
}
