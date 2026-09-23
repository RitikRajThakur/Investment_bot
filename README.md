# 💰 Automated Investment Insights Bot

An AI-powered, full-stack web application designed to help both beginner and experienced investors make smart, data-driven financial decisions. It combines real-time market visualization, dynamic portfolio allocation, and an intelligent LLM advisor.

🌐 **Live Demo:** [https://investment-bot-goby.onrender.com](https://investment-bot-goby.onrender.com)

---

## ✨ Features

- **📊 Personalized Investment Advice:** Recommends tailored investment strategies based on user age, financial goals (Wealth, Retirement, Short-term), and risk tolerance.
- **📈 Real-Time Live Charts:** Embedded TradingView Market Overview & Advanced Candlestick Charts for real-time stock and cryptocurrency tracking.
- **🤖 Groq-Powered AI Chatbot:** High-speed financial query resolution powered by Groq's `llama-3.1-8b-instant` LLM.
- **⚡ Smart Fallback Mechanism:** Automatically parses stock ticker symbols (e.g., `AAPL`, `TSLA`, `MSFT`) and fetches live prices via `yfinance` without consuming AI tokens.
- **🎨 Glassmorphism UI:** Premium dark-mode responsive web interface with micro-animations and Chart.js visuals.

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** HTML5, CSS3 (Glassmorphism), JavaScript (ES6+), Chart.js
- **Market Data:** TradingView Widgets, Yahoo Finance (`yfinance`)
- **AI Engine:** Groq API (`llama-3.1-8b-instant`)
- **Deployment:** Render, GitHub CI/CD

---

## 📁 Project Structure

```text
Chat_bot/
├── app.py              # Flask server & REST API routes
├── ai_chat.py          # Groq AI integration & smart fallback handler
├── api_handler.py      # Real-time stock data handler (yfinance)
├── advisor.py          # Investment advice & portfolio allocation logic
├── requirements.txt    # Python dependencies for deployment
├── .gitignore          # Git exclusion config
└── static/             # Frontend assets
    ├── index.html      # Main application interface
    ├── style.css       # Custom glassmorphism dark theme
    └── script.js       # Dynamic UI logic, Chart.js & Chat widget
```

---

## 🚀 Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RitikRajThakur/Investment_bot.git
   cd Investment_bot
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set your Groq API Key (Optional):**
   ```bash
   export GROQ_API_KEY="your-groq-api-key-here"
   ```

4. **Run the application:**
   ```bash
   python3 app.py
   ```

5. **Open in Browser:**  
   Navigate to `http://127.0.0.1:5000`

---

## 👤 Author

- **Ritik Raj Thakur**  
  - GitHub: [@RitikRajThakur](https://github.com/RitikRajThakur)  
  - LinkedIn: [Ritik Raj Thakur](https://www.linkedin.com/in/ritik-raj-thakur/)
