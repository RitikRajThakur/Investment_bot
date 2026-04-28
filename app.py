from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

from advisor import get_investment_advice, get_portfolio
from api_handler import get_stock_price, get_stock_history
from ai_chat import get_ai_response

app = Flask(__name__, static_folder='static')
CORS(app)

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# API Endpoints
@app.route('/api/advice', methods=['POST'])
def advice():
    data = request.json
    goal = data.get('goal', 'wealth')
    risk = data.get('risk', 'medium')
    age = data.get('age', 30)
    
    advice_text = get_investment_advice(goal, risk, age)
    portfolio = get_portfolio(risk)
    
    return jsonify({
        "advice": advice_text,
        "portfolio": portfolio
    })

@app.route('/api/stock/price', methods=['GET'])
def stock_price():
    symbol = request.args.get('symbol', 'AAPL')
    price = get_stock_price(symbol)
    return jsonify({"price": price})

@app.route('/api/stock/history', methods=['GET'])
def stock_history():
    symbol = request.args.get('symbol', 'AAPL')
    history = get_stock_history(symbol)
    return jsonify({"history": history})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    api_key = data.get('api_key', '')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
        
    reply = get_ai_response(user_message, api_key=api_key)
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
