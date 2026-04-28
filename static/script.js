document.addEventListener('DOMContentLoaded', () => {
    // ---------------- CHART INSTANCES ----------------
    let portfolioChartInstance = null;
    let trendChartInstance = null;

    // Default Chart.js settings for dark theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'Inter';

    // ---------------- ADVANCED LIVE CHART ----------------
    const liveChartSymbolInput = document.getElementById('liveChartSymbol');
    const updateLiveChartBtn = document.getElementById('updateLiveChartBtn');
    const advancedChartContainer = document.getElementById('advancedChartContainer');

    function loadTradingViewChart(symbol) {
        // Clear container
        advancedChartContainer.innerHTML = '<div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%;"></div>';
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.async = true;
        
        const config = {
            "width": "100%",
            "height": "100%",
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "backgroundColor": "rgba(0, 0, 0, 0)",
            "gridColor": "rgba(255, 255, 255, 0.06)",
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "support_host": "https://www.tradingview.com"
        };
        
        script.innerHTML = JSON.stringify(config);
        advancedChartContainer.appendChild(script);
    }

    // Load default chart
    loadTradingViewChart("NASDAQ:AAPL");

    updateLiveChartBtn.addEventListener('click', () => {
        let symbol = liveChartSymbolInput.value.trim().toUpperCase();
        if (!symbol) return;
        loadTradingViewChart(symbol);
    });

    liveChartSymbolInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateLiveChartBtn.click();
    });

    // ---------------- GET ADVICE ----------------
    const getAdviceBtn = document.getElementById('getAdviceBtn');
    const adviceResult = document.getElementById('adviceResult');
    const portfolioCanvas = document.getElementById('portfolioChart');

    getAdviceBtn.addEventListener('click', async () => {
        const goal = document.getElementById('userGoal').value;
        const risk = document.getElementById('userRisk').value;
        const age = document.getElementById('userAge').value;

        getAdviceBtn.innerHTML = 'Analyzing...';
        getAdviceBtn.disabled = true;

        try {
            const response = await fetch('/api/advice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, risk, age: parseInt(age) })
            });
            const data = await response.json();

            // Update Advice Text
            adviceResult.innerHTML = `<p class="advice-text fade-in-up">${data.advice}</p>`;

            // Update Portfolio Chart
            const portfolio = data.portfolio;
            const labels = Object.keys(portfolio);
            const values = Object.values(portfolio);

            if (portfolioChartInstance) {
                portfolioChartInstance.destroy();
            }

            portfolioChartInstance = new Chart(portfolioCanvas, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            '#00d2ff',
                            '#3a7bd5',
                            '#10b981',
                            '#f59e0b',
                            '#8b5cf6'
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    }
                }
            });

        } catch (error) {
            adviceResult.innerHTML = `<p style="color: var(--accent-danger);">Failed to get advice. Check backend.</p>`;
        } finally {
            getAdviceBtn.innerHTML = 'Get Advice';
            getAdviceBtn.disabled = false;
        }
    });

    // ---------------- CHATBOT & API KEY SETTINGS ----------------
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiBtn = document.getElementById('saveApiBtn');

    // Load API Key from local storage if exists
    let userApiKey = localStorage.getItem('groq_api_key') || '';
    if (userApiKey) {
        apiKeyInput.value = userApiKey;
    }

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    saveApiBtn.addEventListener('click', () => {
        userApiKey = apiKeyInput.value.trim();
        localStorage.setItem('groq_api_key', userApiKey);
        settingsPanel.classList.add('hidden');
        addMessage("Settings updated! Your API Key is saved locally.", 'bot');
    });

    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
        if (!chatBox.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatBox.classList.add('hidden');
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Temporary bot typing indicator
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = typingId;
        typingDiv.innerHTML = '<p>...</p>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    api_key: userApiKey
                })
            });
            const data = await response.json();
            
            document.getElementById(typingId).remove();
            addMessage(data.reply, 'bot');
            
        } catch (error) {
            document.getElementById(typingId).remove();
            addMessage("Sorry, I'm having trouble connecting to my backend right now.", 'bot');
        }
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

});
