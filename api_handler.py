import yfinance as yf

# ---------------- STOCK PRICE ----------------
def get_stock_price(symbol):
    try:
        stock = yf.Ticker(symbol)
        # Fast way to get current price
        price = stock.fast_info.last_price
        if price:
            return str(round(price, 2))
        return "Invalid symbol or no data"
    except Exception as e:
        return "Error fetching data"

# ---------------- STOCK HISTORY ----------------
def get_stock_history(symbol):
    try:
        stock = yf.Ticker(symbol)
        # Get last 10 days of history
        hist = stock.history(period="10d")
        
        if hist.empty:
            return []
            
        prices = [round(float(price), 2) for price in hist['Close'].tolist()]
        return prices
    except Exception as e:
        return []