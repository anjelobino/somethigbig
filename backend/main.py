import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from services.stock_service import stock_service, StockServiceException

# Load environment variables
load_dotenv()

app = FastAPI(
    title="StockAI API",
    description="Backend API connecting Alpha Vantage market data to StockAI frontend dashboard",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StockResponse(BaseModel):
    symbol: str
    price: float
    open: float
    high: float
    low: float
    volume: int
    change_percent: float
    change: Optional[float] = None
    previous_close: Optional[float] = None
    latest_trading_day: Optional[str] = None
    api_symbol: Optional[str] = None


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "StockAI FastAPI Backend",
        "endpoints": {
            "get_stock": "/stock/{symbol}"
        }
    }


@app.get("/stock/{symbol}", response_model=StockResponse)
def get_stock(symbol: str):
    """
    Fetch real-time stock quote from Alpha Vantage API
    """
    try:
        quote = stock_service.get_stock_quote(symbol)
        return quote
    except StockServiceException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
