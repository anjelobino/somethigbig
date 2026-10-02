// Sentiment, Historical Predictions Audit Log, Real-Time Feed, and Options Trading Analysis Engine

export const HISTORICAL_PREDICTIONS = [
  {
    id: "pred-101",
    timestamp: "Today, 14:15",
    date: "02 Oct 2026",
    symbol: "TATAMOTORS",
    assetName: "Tata Motors Ltd",
    predictedSentiment: "Extremely Bullish (+89)",
    predictedDirection: "UP",
    predictedMove: "+2.40%",
    predictedTarget: 995.00,
    actualPriceReached: 994.00,
    actualMove: "+3.58%",
    status: "HIT", // "HIT" | "PARTIAL" | "MISSED"
    accuracyScore: 96,
    timeHorizon: "Intraday (4 Hours)",
    driverReason: "1-Month High Breakout with 2.78x volume spike confirmed by JLR international delivery records.",
    recommendedOptionWas: "1000 CE @ ₹26.40 (Surged to ₹38.50, +45% Gain)"
  },
  {
    id: "pred-102",
    timestamp: "Today, 10:30",
    date: "02 Oct 2026",
    symbol: "NIFTY",
    assetName: "NIFTY 50 Index",
    predictedSentiment: "Bullish (+76)",
    predictedDirection: "UP",
    predictedMove: "+0.50%",
    predictedTarget: 25300.00,
    actualPriceReached: 25345.80,
    actualMove: "+0.57%",
    status: "HIT",
    accuracyScore: 98,
    timeHorizon: "Intraday (6 Hours)",
    driverReason: "India VIX compressed to 13.65 + heavy put writing at 25,200 strike created upward drift.",
    recommendedOptionWas: "25300 CE @ ₹138.50 (Hit Target 1 ₹185.00, +33% Gain)"
  },
  {
    id: "pred-103",
    timestamp: "Yesterday, 14:00",
    date: "01 Oct 2026",
    symbol: "SENSEX",
    assetName: "BSE SENSEX Index",
    predictedSentiment: "Bullish (+74)",
    predictedDirection: "UP",
    predictedMove: "+0.60%",
    predictedTarget: 82950.00,
    actualPriceReached: 83050.40,
    actualMove: "+0.58%",
    status: "HIT",
    accuracyScore: 94,
    timeHorizon: "Intraday",
    driverReason: "Banking and Auto sector FII net inflows exceeded ₹2,100 Cr.",
    recommendedOptionWas: "83000 CE @ ₹285.00 (Peaked at ₹375.00, +31% Gain)"
  },
  {
    id: "pred-104",
    timestamp: "01 Oct 2026, 11:15",
    date: "01 Oct 2026",
    symbol: "TCS",
    assetName: "Tata Consultancy Services",
    predictedSentiment: "Bearish (-42)",
    predictedDirection: "DOWN",
    predictedMove: "-0.80%",
    predictedTarget: 3880.00,
    actualPriceReached: 3875.10,
    actualMove: "-0.75%",
    status: "HIT",
    accuracyScore: 95,
    timeHorizon: "1-Day Swing",
    driverReason: "Heavy call writing at 3,920 strike with US tech client budget caution reports.",
    recommendedOptionWas: "3880 PE @ ₹54.00 (Hit Target ₹74.00, +37% Gain)"
  },
  {
    id: "pred-105",
    timestamp: "30 Sep 2026, 09:45",
    date: "30 Sep 2026",
    symbol: "ICICIBANK",
    assetName: "ICICI Bank Ltd",
    predictedSentiment: "Bullish (+85)",
    predictedDirection: "UP",
    predictedMove: "+1.30%",
    predictedTarget: 1265.00,
    actualPriceReached: 1272.00,
    actualMove: "+1.54%",
    status: "HIT",
    accuracyScore: 97,
    timeHorizon: "2-Day Swing",
    driverReason: "1-Month high barrier crossed with PCR climbing to 1.42.",
    recommendedOptionWas: "1280 CE @ ₹24.80 (Hit Target ₹36.00, +45% Gain)"
  },
  {
    id: "pred-106",
    timestamp: "29 Sep 2026, 13:20",
    date: "29 Sep 2026",
    symbol: "RELIANCE",
    assetName: "Reliance Industries Ltd",
    predictedSentiment: "Bullish (+72)",
    predictedDirection: "UP",
    predictedMove: "+1.50%",
    predictedTarget: 2480.00,
    actualPriceReached: 2468.50,
    actualMove: "+1.21%",
    status: "PARTIAL",
    accuracyScore: 82,
    timeHorizon: "2-Day Swing",
    driverReason: "Jio tariff hike sentiment momentum was trimmed slightly by global crude oil fluctuations.",
    recommendedOptionWas: "2460 CE @ ₹48.50 (Achieved Target 1 ₹65.00)"
  },
  {
    id: "pred-107",
    timestamp: "28 Sep 2026, 10:00",
    date: "28 Sep 2026",
    symbol: "SBIN",
    assetName: "State Bank of India",
    predictedSentiment: "Bullish Reversal (+65)",
    predictedDirection: "UP",
    predictedMove: "+1.80%",
    predictedTarget: 830.00,
    actualPriceReached: 818.50,
    actualMove: "-0.78%",
    status: "MISSED",
    accuracyScore: 42,
    timeHorizon: "Intraday",
    driverReason: "State PSU bond yield spike unexpectedly delayed public bank recovery by 48 hours.",
    recommendedOptionWas: "820 CE @ ₹18.20 (Stop-loss hit at ₹12.00, -34%)"
  },
  {
    id: "pred-108",
    timestamp: "27 Sep 2026, 11:30",
    date: "27 Sep 2026",
    symbol: "HDFCBANK",
    assetName: "HDFC Bank Ltd",
    predictedSentiment: "Bullish (+80)",
    predictedDirection: "UP",
    predictedMove: "+1.10%",
    predictedTarget: 1675.00,
    actualPriceReached: 1690.00,
    actualMove: "+1.25%",
    status: "HIT",
    accuracyScore: 98,
    timeHorizon: "1-Day Swing",
    driverReason: "Deposit growth outpaced credit growth for 2nd straight quarter; FII buying surge.",
    recommendedOptionWas: "1700 CE @ ₹28.50 (Hit Target 1 ₹42.00, +47% Gain)"
  }
];

export const PREDICTION_STATS = {
  totalEvaluated: 64,
  accurateHits: 52,
  partialHits: 8,
  missed: 4,
  winRatePercent: 81.25, // 81.25% verified accuracy
  averageGainOnRecommendedOption: "+36.4%",
  avgHoldingTime: "4.5 Hours",
  indicesAccuracy: "88.5%",
  fnoStocksAccuracy: "79.2%"
};

// Real-Time Public Sentiment Stream (News, Social, Institutional, F&O)
export const INITIAL_SENTIMENT_FEED = [
  {
    id: "feed-1",
    timestamp: "Just now",
    source: "Bloomberg / Reuters",
    type: "NEWS",
    asset: "NIFTY & SENSEX",
    headline: "Indian equities reach fresh session highs as FIIs inject ₹2,340 Cr across frontlines",
    sentiment: "BULLISH",
    score: "+0.84",
    impact: "High",
    badge: "Market Wide"
  },
  {
    id: "feed-2",
    timestamp: "1m ago",
    source: "NSE F&O Tape",
    type: "BREAKOUT",
    asset: "TATAMOTORS",
    headline: "Tata Motors prints 1-Month High of ₹994 with 2.78x volume surge; massive call short-covering",
    sentiment: "BULLISH",
    score: "+0.92",
    impact: "Very High",
    badge: "1M High Breakout"
  },
  {
    id: "feed-3",
    timestamp: "3m ago",
    source: "Social Buzz / X (Twitter)",
    type: "SOCIAL",
    asset: "NIFTY 25300 CE",
    headline: "Retail & HNI option traders actively accumulating 25300 CE as India VIX cools to 13.65",
    sentiment: "BULLISH",
    score: "+0.78",
    impact: "Medium",
    badge: "Options Buzz"
  },
  {
    id: "feed-4",
    timestamp: "6m ago",
    source: "CNBC-TV18",
    type: "NEWS",
    asset: "TCS",
    headline: "TCS tests 1-month low of ₹3,875; low volume warns of false breakdown bear trap",
    sentiment: "BEARISH_TRAP",
    score: "-0.35",
    impact: "Medium",
    badge: "False Breakdown Alert"
  },
  {
    id: "feed-5",
    timestamp: "10m ago",
    source: "Institutional Desk",
    type: "INSTITUTIONAL",
    asset: "ICICIBANK",
    headline: "DII block purchases detected in ICICI Bank & HDFC Bank, driving Bank Nifty above 52,200",
    sentiment: "BULLISH",
    score: "+0.88",
    impact: "High",
    badge: "DII Inflow"
  },
  {
    id: "feed-6",
    timestamp: "14m ago",
    source: "NSE Derivatives",
    type: "VIX_UPDATE",
    asset: "INDIA VIX",
    headline: "India VIX softens by -3.2% to 13.65. Option buyer gamma favorable for trending strikes",
    sentiment: "BULLISH",
    score: "+0.71",
    impact: "High",
    badge: "VIX Volatility"
  }
];

// Helper to calculate dynamic Best Option Trade & Expected Min-Max Price Range
export function calculateOptionsIntelligence(stock, vixLevel = 13.65) {
  const price = stock.price;
  const isPos = stock.isPositive;
  const daysToExpiry = 6; // Typical near-term weekly/monthly trading horizon
  
  // Standard Deviation Formula for Expected Move Range:
  // Expected Move = Spot * (VIX / 100) * sqrt(Days / 365)
  const annualVolFactor = (vixLevel / 100);
  const timeFactor = Math.sqrt(daysToExpiry / 365);
  const expectedMovePercent = (annualVolFactor * timeFactor * 100) * 1.15; // 1-sigma with fat-tail adjustment
  const expectedMovePoints = price * (expectedMovePercent / 100);
  
  const minPriceRange = Number((price - expectedMovePoints).toFixed(2));
  const maxPriceRange = Number((price + expectedMovePoints).toFixed(2));
  
  // Breakout verification logic
  const distanceTo1MHigh = stock.oneMonthHigh ? Math.abs(((stock.oneMonthHigh - price) / price) * 100) : 1.5;
  const distanceTo1MLow = stock.oneMonthLow ? Math.abs(((price - stock.oneMonthLow) / price) * 100) : 2.0;
  
  const isNear1MHigh = distanceTo1MHigh <= 1.5;
  const isNear1MLow = distanceTo1MLow <= 1.5;
  
  return {
    vixLevel,
    vixCategory: vixLevel < 12 ? "Low Volatility (Option selling preferred)" : vixLevel < 17 ? "Optimal Mild Volatility (Best for Option Buyers)" : "High Volatility (High Premium Risk)",
    expectedMovePercent: expectedMovePercent.toFixed(2),
    minPriceRange,
    maxPriceRange,
    isNear1MHigh,
    isNear1MLow,
    distanceTo1MHigh: distanceTo1MHigh.toFixed(2),
    distanceTo1MLow: distanceTo1MLow.toFixed(2)
  };
}
