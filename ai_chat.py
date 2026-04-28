from groq import Groq
import re
from api_handler import get_stock_price

def get_ai_response(user_input, api_key=None):
    if not api_key or api_key.strip() == "":
        import os
        # Fallback to environment variable if set
        api_key = os.environ.get("GROQ_API_KEY", "")
        
    if not api_key or api_key.strip() == "":
        return smart_fallback_response(user_input)

    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a highly intelligent financial advisor bot. Provide concise, data-backed investment advice. When discussing specific stocks, advise the user to check their real-time prices on the dashboard."},
                {"role": "user", "content": user_input}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        # If API key is invalid or request fails, fallback
        return f"Error connecting to Groq (Check your API Key). Fallback: " + smart_fallback_response(user_input)

def smart_fallback_response(user_input):
    text = user_input.upper()
    
    # Try to extract a likely stock symbol
    words = text.replace('?', '').replace(',', '').split()
    ignore_words = {"PRICE", "STOCK", "OF", "THE", "IS", "WHAT", "TELL", "ME", "FOR", "HOW", "MUCH", "BUY", "SELL", "SHOULD", "I", "A", "AN"}
    
    for word in words:
        if 1 <= len(word) <= 5 and word.isalpha() and word not in ignore_words:
            price = get_stock_price(word)
            if price and price != "Invalid symbol or no data" and price != "Error fetching data":
                return f"The current real-time price of {word} is ${price}. For deeper analysis, please provide a Groq API Key in the chat settings."

    text_lower = user_input.lower()
    if "stock" in text_lower:
        return "Stocks are great for long-term investment. Check the live Market Overview on your dashboard! (For detailed analysis, enter an API key in settings)."
    elif "crypto" in text_lower:
        return "Crypto is highly volatile. Please invest carefully."
    elif "safe" in text_lower or "low risk" in text_lower:
        return "Consider bonds, fixed deposits, or mutual funds for low risk."
    else:
        return "Please enter your Groq API key in the chat settings (⚙️) for highly personalized, intelligent investment insights. Otherwise, try asking me for the 'price of AAPL'!"