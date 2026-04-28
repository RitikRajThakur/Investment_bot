def get_investment_advice(goal, risk, age):
    if goal == "wealth":
        if risk == "high":
            return "Invest in stocks and crypto."
        else:
            return "Try mutual funds and ETFs."
    
    elif goal == "retirement":
        if age < 30:
            return "Aggressive equity investment."
        else:
            return "Safer options like bonds and PPF."
    
    elif goal == "short-term":
        return "Fixed deposits or liquid funds"


def get_portfolio(risk):
    if risk == "high":
        return {"Stocks": 60, "Crypto": 20, "Mutual Funds": 20}
    elif risk == "medium":
        return {"Stocks": 40, "Mutual Funds": 40, "Bonds": 20}
    else:
        return {"Bonds": 50, "FD": 30, "Gold": 20}