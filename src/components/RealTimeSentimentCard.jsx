import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  RefreshCw, 
  MessageSquare, 
  Globe, 
  Building2, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause
} from 'lucide-react';
import { INITIAL_SENTIMENT_FEED } from '../data/sentimentOptionsData';

export default function RealTimeSentimentCard({ currentStock, onSelectStock }) {
  const [feedItems, setFeedItems] = useState(INITIAL_SENTIMENT_FEED);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastTickTime, setLastTickTime] = useState('Just now');
  const [sentimentScore, setSentimentScore] = useState(currentStock?.sentiment?.score || 76);

  // Real-Time Live Feed Simulation: Adds simulated live sentiment ticks every 5 seconds when active
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const simulationPool = [
        {
          id: `feed-${Date.now()}`,
          timestamp: `Live ${timeStr}`,
          source: "NSE F&O Block Window",
          type: "INSTITUTIONAL",
          asset: currentStock?.symbol || "NIFTY",
          headline: `Aggressive buy order block filled for ${currentStock?.symbol || 'NIFTY'} 25300 CE (+₹4.2 Cr premium turnover)`,
          sentiment: "BULLISH",
          score: "+0.86",
          impact: "High",
          badge: "Block Trade"
        },
        {
          id: `feed-${Date.now() + 1}`,
          timestamp: `Live ${timeStr}`,
          source: "Social Buzz Sentiment",
          type: "SOCIAL",
          asset: "MARKET WIDE",
          headline: "Retail crowd sentiment surges to 81% Bullish on Nifty and Sensex after breakout retest",
          sentiment: "BULLISH",
          score: "+0.79",
          impact: "Medium",
          badge: "Crowd Flow"
        },
        {
          id: `feed-${Date.now() + 2}`,
          timestamp: `Live ${timeStr}`,
          source: "Derivative Desk News",
          type: "VIX_UPDATE",
          asset: "INDIA VIX",
          headline: "India VIX ticks at 13.62; option premiums exhibit low implied volatility decay",
          sentiment: "BULLISH",
          score: "+0.72",
          impact: "Medium",
          badge: "VIX Real-Time"
        }
      ];

      const randomItem = simulationPool[Math.floor(Math.random() * simulationPool.length)];

      setFeedItems((prev) => [randomItem, ...prev.slice(0, 10)]);
      setLastTickTime(timeStr);

      // Micro adjustment to score to show real-time live pulse
      setSentimentScore((prev) => {
        const delta = (Math.random() * 2 - 0.9);
        return Math.min(Math.max(Math.round(prev + delta), 40), 95);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, currentStock]);

  const handleManualRefresh = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const manualTick = {
      id: `manual-${Date.now()}`,
      timestamp: `Live ${timeStr}`,
      source: "Manual Intelligence Sync",
      type: "NEWS",
      asset: currentStock?.symbol || "NIFTY",
      headline: `Real-time public sentiment aggregated for ${currentStock?.symbol}: Sentiment score at ${sentimentScore}% Bullish.`,
      sentiment: "BULLISH",
      score: "+0.85",
      impact: "High",
      badge: "Real-Time Sync"
    };
    setFeedItems((prev) => [manualTick, ...prev.slice(0, 10)]);
    setLastTickTime(timeStr);
  };

  const sentiment = currentStock?.sentiment || {
    score: sentimentScore,
    label: "Strongly Bullish",
    newsScore: 82,
    socialScore: 74,
    institutionalScore: 88,
    pcrScore: 78,
    fearGreedIndex: 68,
    fearGreedLabel: "Greed"
  };

  return (
    <div className="bg-[#181a20] border border-[#282d39] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Top Header: Title + Live Streaming Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#282d39]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00D09C]/15 text-[#00D09C]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Real-Time Public Sentiment Engine
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#00D09C] border border-[#00D09C]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-ping"></span>
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregating news sentiment, Twitter/X retail buzz, FII/DII institutional cash flow, and derivative options order-book ticks.
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isLiveStreaming
                ? 'bg-[#00D09C]/10 text-[#00D09C] border-[#00D09C]/40 hover:bg-[#00D09C]/20'
                : 'bg-[#252a38] text-slate-400 border-[#303747] hover:text-white'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Streaming: ON' : 'Streaming: Paused'}</span>
          </button>

          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-xl bg-[#242936] hover:bg-[#2c3342] text-slate-300 hover:text-white border border-[#343c4e] transition-colors"
            title="Force refresh sentiment pulse"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gauge + 4 Multi-Source Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (5 Cols): Sentiment Speedometer & Fear-Greed Index */}
        <div className="lg:col-span-5 bg-[#12141a] rounded-2xl p-5 border border-[#262b37] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Overall Market Sentiment Score
            </span>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {sentimentScore}<span className="text-2xl text-slate-500 font-sans">/100</span>
                </div>
                <div className="text-sm font-bold text-[#00D09C] mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{sentiment.label || 'Strongly Bullish Bias'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fear & Greed</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">
                  {sentiment.fearGreedIndex || 68}
                </span>
                <span className="text-[11px] text-slate-300 block font-semibold">
                  {sentiment.fearGreedLabel || 'Greed'}
                </span>
              </div>
            </div>

            {/* Gauge visual slider */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span className="text-rose-400">Extreme Fear (0)</span>
                <span className="text-amber-400">Neutral (50)</span>
                <span className="text-[#00D09C]">Extreme Greed (100)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#232938] overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-[#00D09C] rounded-full transition-all duration-500"
                  style={{ width: `${sentimentScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-[#191d27] rounded-xl p-3 border border-[#262c3c] text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-0.5">Real-time Public Pulse:</span>
            Indian markets are showing strong retail and institutional consensus. Low volatility (India VIX ~13.6) combined with positive retail buzz is propelling bullish call option buying.
          </div>
        </div>

        {/* Right Column (7 Cols): 4 Individual Sentiment Sources */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Source 1: News Sentiment */}
          <div className="bg-[#12141a] rounded-2xl p-4 border border-[#242938] hover:border-[#384155] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Financial News NLP</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#00D09C]">
                {sentiment.newsScore || 82}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scanned 420+ articles from Bloomberg, Reuters, ET Now. 82% of coverage is positive on earnings growth and rate-cut outlook.
            </p>
          </div>

          {/* Source 2: Social Buzz (Twitter/X & Reddit) */}
          <div className="bg-[#12141a] rounded-2xl p-4 border border-[#242938] hover:border-[#384155] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Social & Retail Buzz</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {sentiment.socialScore || 74}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Twitter/X fin-influencer and retail chatter is 74% bullish. High call option sentiment with strong discussion on breakout stocks.
            </p>
          </div>

          {/* Source 3: Institutional Inflows (FII/DII) */}
          <div className="bg-[#12141a] rounded-2xl p-4 border border-[#242938] hover:border-[#384155] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>FII & DII Inflows</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {sentiment.institutionalScore || 88}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              FIIs bought net +₹2,340 Cr in cash today, while DIIs added +₹1,620 Cr. Institutional conviction remains at multi-month highs.
            </p>
          </div>

          {/* Source 4: Options Derivatives PCR Sentiment */}
          <div className="bg-[#12141a] rounded-2xl p-4 border border-[#242938] hover:border-[#384155] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Options PCR Flow</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {sentiment.pcrScore || 78}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Put-Call Ratio (PCR) is 1.18. Heavy put writing below spot indicates traders are writing support puts, expecting upside continuation.
            </p>
          </div>

        </div>

      </div>

      {/* Live Stream Ticker Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Real-Time Sentiment Wire
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Last update: {lastTickTime}
          </span>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {feedItems.map((item) => {
            const isBull = item.sentiment === 'BULLISH';

            return (
              <div
                key={item.id}
                className="bg-[#12141a] hover:bg-[#161922] border border-[#242938] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                      isBull
                        ? 'bg-[#00D09C]/15 text-[#00D09C]'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {isBull ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-white px-1.5 py-0.5 rounded bg-[#202534]">
                        {item.asset}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-slate-500">• {item.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                      {item.headline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c2230] text-slate-300 border border-[#2b3346] whitespace-nowrap">
                    {item.badge}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isBull
                        ? 'bg-[#00D09C]/10 text-[#00D09C]'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {item.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
