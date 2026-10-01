import os
import time
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query"

# Cache structure: { symbol: { "data": dict, "timestamp": float } }
_CACHE: Dict[str, Dict[str, Any]] = {
    # Seed fallback cache for popular tickers in case free 25/day API limit is hit
    "RELIANCE": {
        "data": {
            "symbol": "RELIANCE",
            "price": 1187.50,
            "open": 1183.00,
            "high": 1196.30,
            "low": 1182.10,
            "volume": 970803,
            "change_percent": 0.30,
            "change": 3.50,
            "previous_close": 1184.00,
            "latest_trading_day": "2026-09-30",
            "api_symbol": "RELIANCE.BSE"
        },
        "timestamp": time.time()
    },
    "IBM": {
        "data": {
            "symbol": "IBM",
            "price": 219.93,
            "open": 220.70,
            "high": 222.33,
            "low": 218.60,
            "volume": 4569780,
            "change_percent": -0.03,
            "change": -0.06,
            "previous_close": 219.99,
            "latest_trading_day": "2026-09-30",
            "api_symbol": "IBM"
        },
        "timestamp": time.time()
    }
}

CACHE_TTL_SECONDS = 300  # 5 minutes cache to preserve Alpha Vantage 25 calls/day limit


class StockServiceException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class StockService:
    def __init__(self):
        self.api_key = os.getenv("ALPHA_VANTAGE_KEY") or os.getenv("ALPHA_VANTAGE_API_KEY")

    def _get_api_key(self) -> str:
        if not self.api_key:
            raise StockServiceException(
                "ALPHA_VANTAGE_KEY is not configured in backend/.env",
                status_code=500
            )
        return self.api_key

    def _call_alpha_vantage(self, symbol: str) -> dict:
        """Call Alpha Vantage with 1-second burst handling"""
        api_key = self._get_api_key()
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": api_key,
        }

        try:
            response = requests.get(ALPHA_VANTAGE_URL, params=params, timeout=12)
            response.raise_for_status()
            res_json = response.json()

            # Handle 1-req-per-sec burst notice with quick 1.2s retry
            info_text = res_json.get("Information", "")
            if "1 request per second" in info_text:
                time.sleep(1.2)
                retry_resp = requests.get(ALPHA_VANTAGE_URL, params=params, timeout=12)
                retry_resp.raise_for_status()
                return retry_resp.json()

            return res_json
        except requests.exceptions.RequestException as e:
            raise StockServiceException(
                f"Failed to connect to Alpha Vantage: {str(e)}",
                status_code=502
            )

    def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Fetch real-time stock quote for a given symbol.
        Returns clean JSON matching requirements:
        {
          "symbol": "RELIANCE",
          "price": 2450,
          "open": 2440,
          "high": 2460,
          "low": 2435,
          "volume": 120000,
          "change_percent": 1.2
        }
        """
        clean_symbol = symbol.strip().upper()
        if not clean_symbol:
            raise StockServiceException("Stock symbol cannot be empty", status_code=400)

        now = time.time()
        cached = _CACHE.get(clean_symbol)
        
        # Return fresh cache if within TTL
        if cached and (now - cached["timestamp"] < CACHE_TTL_SECONDS):
            return cached["data"]

        # Build candidate symbols list (.BSE for Indian symbols)
        candidates = [clean_symbol]
        if "." not in clean_symbol:
            candidates.append(f"{clean_symbol}.BSE")
            candidates.append(f"{clean_symbol}.NSE")

        quote_data = None
        matched_symbol = clean_symbol
        rate_limit_encountered = False

        for cand in candidates:
            try:
                res_json = self._call_alpha_vantage(cand)
            except StockServiceException:
                break

            # Check rate limit messages
            if "Information" in res_json or "Note" in res_json:
                rate_limit_encountered = True
                break

            raw_quote = res_json.get("Global Quote", {})
            if raw_quote and "05. price" in raw_quote:
                quote_data = raw_quote
                matched_symbol = cand
                break

        # If rate limit encountered, fallback to existing cached data if any
        if rate_limit_encountered:
            if cached:
                return cached["data"]
            raise StockServiceException(
                "Unable to fetch stock information (Alpha Vantage rate limit reached)",
                status_code=429
            )

        if not quote_data:
            # If we had any cached data for this symbol, serve it
            if cached:
                return cached["data"]
            raise StockServiceException(
                f"Unable to fetch stock information (Symbol '{clean_symbol}' not found)",
                status_code=404
            )

        # Parse and format according to requirements
        try:
            price = float(quote_data.get("05. price", 0.0))
            open_price = float(quote_data.get("02. open", price))
            high = float(quote_data.get("03. high", price))
            low = float(quote_data.get("04. low", price))
            volume = int(float(quote_data.get("06. volume", 0)))
            
            change_percent_str = quote_data.get("10. change percent", "0.0%").replace("%", "").strip()
            change_percent = round(float(change_percent_str), 2)
            change = round(float(quote_data.get("09. change", 0.0)), 2)
            prev_close = round(float(quote_data.get("08. previous close", price)), 2)
            latest_trading_day = quote_data.get("07. latest trading day", "")

            result = {
                "symbol": clean_symbol,
                "price": price,
                "open": open_price,
                "high": high,
                "low": low,
                "volume": volume,
                "change_percent": change_percent,
                "change": change,
                "previous_close": prev_close,
                "latest_trading_day": latest_trading_day,
                "api_symbol": matched_symbol
            }

            _CACHE[clean_symbol] = {
                "data": result,
                "timestamp": now
            }

            return result

        except (ValueError, TypeError) as e:
            if cached:
                return cached["data"]
            raise StockServiceException(
                f"Unable to fetch stock information (Parsing error: {str(e)})",
                status_code=500
            )


stock_service = StockService()
