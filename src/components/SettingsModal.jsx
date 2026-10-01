import React, { useState } from 'react';
import { X, SlidersHorizontal, Cpu, Database, Bell, Check, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [predictionTimeframe, setPredictionTimeframe] = useState('15m');
  const [confidenceThreshold, setConfidenceThreshold] = useState('65%');
  const [fastApiUrl, setFastApiUrl] = useState('http://localhost:8000');
  const [alphaVantageKey, setAlphaVantageKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#121824] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d121c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">StockAI Settings & Model Config</h3>
              <p className="text-xs text-slate-400">Configure parameters & backend integration endpoints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Prediction Horizon */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Default Prediction Timeframe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['5m', '15m', '30m', '1h'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setPredictionTimeframe(tf)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-all ${
                    predictionTimeframe === tf
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Model Confidence Sensitivity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confidence Filter Minimum
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['50%', '65%', '80%'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setConfidenceThreshold(lvl)}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-all ${
                    confidenceThreshold === lvl
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/60'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Scalability Future Backend Config */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Future Backend & API Hooks
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  FastAPI Backend Endpoint URL
                </label>
                <input
                  type="text"
                  value={fastApiUrl}
                  onChange={(e) => setFastApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full bg-[#0d121c] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Alpha Vantage API Key (Optional)
                </label>
                <input
                  type="password"
                  value={alphaVantageKey}
                  onChange={(e) => setAlphaVantageKey(e.target.value)}
                  placeholder="demo or enter API key"
                  className="w-full bg-[#0d121c] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0d121c] flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Model: LSTM-DeepPredict v2.4
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs shadow-lg shadow-sky-500/25 flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
