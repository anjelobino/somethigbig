import React, { useState, useRef, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  CandlestickChart, 
  LineChart, 
  Maximize2, 
  Sparkles, 
  Clock, 
  Layers,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function PriceChartPlaceholder({ stock }) {
  const [timeframe, setTimeframe] = useState('15m');
  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' | 'area'
  const [showPredictionZone, setShowPredictionZone] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const svgRef = useRef(null);

  const history = useMemo(() => {
    if (!stock?.chartHistory || stock.chartHistory.length === 0) {
      return [];
    }
    return stock.chartHistory;
  }, [stock]);

  if (!stock || history.length === 0) {
    return (
      <div className="bg-[#121824] rounded-2xl border border-slate-800 p-8 text-center text-slate-400">
        No chart data available
      </div>
    );
  }

  // Calculate scales
  const prices = history.map((c) => c.high || c.price);
  const lows = history.map((c) => c.low || c.price);
  const volumes = history.map((c) => c.volume || 100);

  const minPrice = Math.min(...lows) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...volumes) || 1;

  // SVG dimensions
  const svgWidth = 850;
  const svgHeight = 360;
  const paddingLeft = 40;
  const paddingRight = 70;
  const paddingTop = 25;
  const paddingBottom = 45;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;
  const volumeHeight = 65;

  const candleSpacing = plotWidth / history.length;
  const candleWidth = Math.max(6, candleSpacing * 0.65);

  const getY = (val) => {
    return paddingTop + (1 - (val - minPrice) / priceRange) * (plotHeight - volumeHeight);
  };

  const getVolY = (vol) => {
    const vH = (vol / maxVolume) * volumeHeight;
    return svgHeight - paddingBottom - vH;
  };

  // Build Area Path
  const areaPoints = history.map((c, i) => {
    const x = paddingLeft + i * candleSpacing + candleSpacing / 2;
    const y = getY(c.close || c.price);
    return `${x},${y}`;
  });
  const firstX = paddingLeft + candleSpacing / 2;
  const lastX = paddingLeft + (history.length - 1) * candleSpacing + candleSpacing / 2;
  const baselineY = svgHeight - paddingBottom - volumeHeight;
  const areaPath = `M ${firstX},${baselineY} L ${areaPoints.join(' L ')} L ${lastX},${baselineY} Z`;
  const linePath = `M ${areaPoints.join(' L ')}`;

  // Active display point (hovered or latest)
  const displayPoint = hoveredCandle || history[history.length - 1];

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Top Bar: Stock info, Timeframe toggles & Chart controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-800/80">
        
        {/* Left: Ticker & Live HUD numbers */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">{stock.symbol}</span>
            <span className="text-xs text-slate-400 font-mono">15M • {stock.exchange}</span>
          </div>

          {/* Real-time OHLC HUD */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>O: <span className="text-slate-200">{stock.currency}{displayPoint.open || displayPoint.price}</span></span>
            <span>H: <span className="text-emerald-400">{stock.currency}{displayPoint.high || displayPoint.price}</span></span>
            <span>L: <span className="text-rose-400">{stock.currency}{displayPoint.low || displayPoint.price}</span></span>
            <span>C: <span className="text-sky-300 font-semibold">{stock.currency}{displayPoint.close || displayPoint.price}</span></span>
            {displayPoint.isPrediction && (
              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold border border-sky-500/30">
                AI PREDICTION
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & Timeframes */}
        <div className="flex items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-[#0d121c] p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            {['1m', '5m', '15m', '1H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-sky-500/20 text-sky-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[#0d121c] p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'candlestick'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Chart"
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Zone Toggle */}
          <button
            onClick={() => setShowPredictionZone(!showPredictionZone)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              showPredictionZone
                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                : 'bg-[#0d121c] text-slate-400 border-slate-800'
            }`}
            title="Toggle AI 15-Minute Forecast Corridor"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span className="hidden md:inline">AI Overlay</span>
          </button>
        </div>
      </div>

      {/* Main Chart SVG Render Canvas */}
      <div className="relative w-full h-[360px] select-none">
        
        {/* Background TradingView subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-dashed border-slate-500 w-full" />
          <div className="border-b border-dashed border-slate-500 w-full" />
          <div className="border-b border-dashed border-slate-500 w-full" />
          <div className="border-b border-dashed border-slate-500 w-full" />
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Price Grid Lines & Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const priceVal = minPrice + (maxPrice - minPrice) * (1 - pct);
            const y = paddingTop + pct * (plotHeight - volumeHeight);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1f2937"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={svgWidth - paddingRight + 8}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {priceVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume baseline separator */}
          <line
            x1={paddingLeft}
            y1={baselineY}
            x2={svgWidth - paddingRight}
            y2={baselineY}
            stroke="#1e293b"
            strokeWidth="1"
          />
          <text
            x={paddingLeft}
            y={baselineY + 12}
            fill="#475569"
            fontSize="9"
            fontFamily="JetBrains Mono"
          >
            VOL
          </text>

          {/* Volume Histogram Bars */}
          {history.map((c, i) => {
            const x = paddingLeft + i * candleSpacing + candleSpacing / 2;
            const isGreen = (c.close || c.price) >= (c.open || c.price);
            const y = getVolY(c.volume || 100);
            const height = baselineY - y;

            return (
              <rect
                key={`vol-${i}`}
                x={x - candleWidth / 2}
                y={y}
                width={candleWidth}
                height={Math.max(2, height)}
                fill={c.isPrediction ? '#6366f1' : (isGreen ? '#10b981' : '#f43f5e')}
                opacity={c.isPrediction ? 0.8 : 0.35}
                rx="1"
              />
            );
          })}

          {/* AI Prediction Shaded Zone */}
          {showPredictionZone && (
            <g>
              {/* Highlight background on the last prediction bar */}
              <rect
                x={paddingLeft + (history.length - 1) * candleSpacing - 5}
                y={paddingTop}
                width={candleSpacing + 10}
                height={plotHeight - volumeHeight}
                fill="url(#predictionGradient)"
                rx="4"
              />
              {/* Vertical dotted prediction boundary */}
              <line
                x1={paddingLeft + (history.length - 1) * candleSpacing}
                y1={paddingTop}
                x2={paddingLeft + (history.length - 1) * candleSpacing}
                y2={baselineY}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </g>
          )}

          {/* Area Chart Mode */}
          {chartType === 'area' && (
            <g>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2" />
            </g>
          )}

          {/* Candlestick Chart Mode */}
          {chartType === 'candlestick' && history.map((c, i) => {
            const x = paddingLeft + i * candleSpacing + candleSpacing / 2;
            const isGreen = (c.close || c.price) >= (c.open || c.price);
            const openY = getY(c.open || c.price);
            const closeY = getY(c.close || c.price);
            const highY = getY(c.high || c.price);
            const lowY = getY(c.low || c.price);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(3, Math.abs(closeY - openY));

            if (c.isPrediction) {
              return (
                <g key={`candle-${i}`}>
                  {/* Glowing predicted candle */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill="#4338ca"
                    stroke="#a5b4fc"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    rx="1"
                  />
                </g>
              );
            }

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={isGreen ? '#10b981' : '#f43f5e'}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Time axis labels */}
          {history.map((c, i) => {
            if (i % 3 !== 0 && i !== history.length - 1) return null;
            const x = paddingLeft + i * candleSpacing + candleSpacing / 2;
            return (
              <text
                key={`time-${i}`}
                x={x}
                y={svgHeight - 12}
                fill={c.isPrediction ? '#a5b4fc' : '#64748b'}
                fontSize="10"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
                fontWeight={c.isPrediction ? 'bold' : 'normal'}
              >
                {c.time}
              </text>
            );
          })}

          {/* Interactive invisible hit areas for cursor tracking */}
          {history.map((c, i) => {
            const x = paddingLeft + i * candleSpacing;
            return (
              <rect
                key={`hit-${i}`}
                x={x}
                y={paddingTop}
                width={candleSpacing}
                height={svgHeight - paddingTop}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredCandle(c)}
              />
            );
          })}
        </svg>

        {/* Floating AI Callout tag on prediction bar */}
        {showPredictionZone && (
          <div className="absolute top-4 right-16 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Target: {stock.currency}{stock.prediction?.targetPrice || stock.price}</span>
          </div>
        )}
      </div>

      {/* Chart Footer Note */}
      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-400" />
          Timezone: UTC+5:30 (IST)
        </span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-sm bg-emerald-500"></span> Up Candle
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-sm bg-rose-500"></span> Down Candle
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2 h-2 rounded-sm bg-indigo-500"></span> 15m AI Projection
          </span>
        </span>
      </div>
    </div>
  );
}
