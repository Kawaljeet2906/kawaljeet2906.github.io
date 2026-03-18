// --- 1. MOCK DATA GENERATION (Top 50 NIFTY Stocks) ---
const nifty50Symbols = [
    "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "BHARTIARTL", "SBIN", "INFY", "LICI", "ITC", "HINDUNILVR", 
    "LT", "BAJFINANCE", "HCLTECH", "MARUTI", "SUNPHARMA", "ADANIENT", "KOTAKBANK", "TITAN", "ONGC", "TATAMOTORS", 
    "NTPC", "AXISBANK", "DMART", "POWERGRID", "ULTRACEMCO", "ASIANPAINT", "COALINDIA", "BAJAJFINSV", "BAJAJ-AUTO", "ZOMATO", 
    "M&M", "TATASTEEL", "SIEMENS", "HAL", "JSWSTEEL", "GRASIM", "TECHM", "WIPRO", "HINDALCO", "LTIM", 
    "ADANIPORTS", "NESTLEIND", "CIPLA", "TRENT", "DRREDDY", "INDUSINDBK", "EICHERMOT", "APOLLOHOSP", "DIVISLAB", "TATACONSUM"
];

// Generate robust mock data with realistic random prices
const marketData = nifty50Symbols.map(symbol => {
    const basePrice = (Math.random() * 4000 + 100).toFixed(2);
    const change = (Math.random() * 6 - 3).toFixed(2); // -3% to +3% change
    return {
        symbol: symbol,
        price: parseFloat(basePrice),
        change: parseFloat(change)
    };
});

// --- 2. STATE MANAGEMENT (localStorage) ---
let portfolio = JSON.parse(localStorage.getItem('tradeDash_portfolio')) || [];
let watchlist = JSON.parse(localStorage.getItem('tradeDash_watchlist')) || [];

// --- 3. DOM ELEMENTS ---
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const stocksGrid = document.getElementById('stocksGrid');
const addStockForm = document.getElementById('addStockForm');
const portfolioBody = document.getElementById('portfolioBody');
const watchlistContainer = document.getElementById('watchlistContainer');

// --- 4. THEME TOGGLE ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    updateChartsTheme(isDark);
});

// --- 5. RENDER TOP 50 STOCKS ---
function renderStocksGrid(filterText = "") {
    stocksGrid.innerHTML = "";
    const filteredStocks = marketData.filter(s => s.symbol.toLowerCase().includes(filterText.toLowerCase()));
    
    filteredStocks.forEach(stock => {
        const isPositive = stock.change >= 0;
        const colorClass = isPositive ? 'positive' : 'negative';
        const isWatched = watchlist.includes(stock.symbol);

        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `
            <div class="stock-card-header">
                <h4>${stock.symbol}</h4>
                <button class="watch-btn ${isWatched ? 'active' : ''}" onclick="toggleWatchlist('${stock.symbol}')">
                    <i class="ph-fill ph-star"></i>
                </button>
            </div>
            <p>NSE</p>
            <h3>₹${stock.price.toLocaleString('en-IN')}</h3>
            <span class="${colorClass}">${isPositive ? '+' : ''}${stock.change}%</span>
        `;
        stocksGrid.appendChild(card);
    });
}

// --- 6. WATCHLIST LOGIC ---
window.toggleWatchlist = function(symbol) {
    if (watchlist.includes(symbol)) {
        watchlist = watchlist.filter(s => s !== symbol);
    } else {
        watchlist.push(symbol);
    }
    saveData();
    renderStocksGrid(searchInput.value);
    renderWatchlist();
};

function renderWatchlist() {
    watchlistContainer.innerHTML = "";
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p style='color: var(--text-muted);'>Watchlist is empty.</p>";
        return;
    }

    watchlist.forEach(symbol => {
        const stock = marketData.find(s => s.symbol === symbol) || { symbol, price: 0, change: 0 };
        const isPositive = stock.change >= 0;
        
        const item = document.createElement('div');
        item.className = 'watchlist-item';
        item.innerHTML = `
            <div>
                <strong>${stock.symbol}</strong>
                <div class="${isPositive ? 'positive' : 'negative'}" style="font-size: 0.8rem">
                    ${isPositive ? '+' : ''}${stock.change}%
                </div>
            </div>
            <strong>₹${stock.price.toLocaleString('en-IN')}</strong>
        `;
        watchlistContainer.appendChild(item);
    });
}

// --- 7. PORTFOLIO LOGIC ---
addStockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const symbol = document.getElementById('stockSymbolInput').value.toUpperCase();
    const qty = parseInt(document.getElementById('stockQtyInput').value);
    const price = parseFloat(document.getElementById('stockPriceInput').value);

    // Add or Update
    const existingIndex = portfolio.findIndex(p => p.symbol === symbol);
    if (existingIndex > -1) {
        const ex = portfolio[existingIndex];
        const newQty = ex.qty + qty;
        const newAvg = ((ex.qty * ex.avgPrice) + (qty * price)) / newQty;
        portfolio[existingIndex] = { symbol, qty: newQty, avgPrice: newAvg };
    } else {
        portfolio.push({ symbol, qty, avgPrice: price });
    }

    saveData();
    addStockForm.reset();
    renderPortfolio();
});

window.deletePortfolioItem = function(symbol) {
    portfolio = portfolio.filter(p => p.symbol !== symbol);
    saveData();
    renderPortfolio();
};

function renderPortfolio() {
    portfolioBody.innerHTML = "";
    let totalInvested = 0;
    let totalCurrent = 0;

    if (portfolio.length === 0) {
        portfolioBody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No stocks in portfolio</td></tr>";
    }

    portfolio.forEach(item => {
        const marketStock = marketData.find(s => s.symbol === item.symbol);
        const ltp = marketStock ? marketStock.price : item.avgPrice; // Fallback to avg if not found
        
        const invested = item.qty * item.avgPrice;
        const current = item.qty * ltp;
        const pnl = current - invested;
        const pnlPercent = ((pnl / invested) * 100).toFixed(2);
        
        totalInvested += invested;
        totalCurrent += current;

        const isPositive = pnl >= 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.symbol}</strong></td>
            <td>${item.qty}</td>
            <td>₹${item.avgPrice.toFixed(2)}</td>
            <td>₹${ltp.toFixed(2)}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">
                ₹${Math.abs(pnl).toFixed(2)} (${isPositive ? '+' : ''}${pnlPercent}%)
            </td>
            <td>
                <button class="delete-btn" onclick="deletePortfolioItem('${item.symbol}')">
                    <i class="ph-fill ph-trash"></i>
                </button>
            </td>
        `;
        portfolioBody.appendChild(tr);
    });

    // Update Summary Cards
    const totalPnL = totalCurrent - totalInvested;
    document.getElementById('totalInvested').innerText = `₹${totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    document.getElementById('currentValue').innerText = `₹${totalCurrent.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    
    const pnlEl = document.getElementById('totalPnL');
    pnlEl.innerText = `₹${Math.abs(totalPnL).toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    pnlEl.className = totalPnL >= 0 ? 'positive' : 'negative';
    if(totalPnL < 0) pnlEl.innerText = "-" + pnlEl.innerText;

    updatePortfolioChart();
}

function saveData() {
    localStorage.setItem('tradeDash_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('tradeDash_watchlist', JSON.stringify(watchlist));
}

// --- 8. SEARCH FUNCTIONALITY ---
searchInput.addEventListener('input', (e) => {
    renderStocksGrid(e.target.value);
});


// --- 9. CHARTS (Chart.js) ---
let marketChartInstance = null;
let portfolioChartInstance = null;

function initCharts() {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#333333' : '#e2e8f0';

    // Market Trend Chart (Mock Data)
    const ctxMarket = document.getElementById('marketChart').getContext('2d');
    marketChartInstance = new Chart(ctxMarket, {
        type: 'line',
        data: {
            labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:15'],
            datasets: [{
                label: 'NIFTY 50',
                data: [22300, 22350, 22280, 22400, 22420, 22390, 22453],
                borderColor: '#3b82f6',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor } },
                y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
        }
    });

    // Portfolio Pie Chart
    const ctxPort = document.getElementById('portfolioChart').getContext('2d');
    portfolioChartInstance = new Chart(ctxPort, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: textColor } }
            }
        }
    });
}

function updatePortfolioChart() {
    if (!portfolioChartInstance) return;

    const labels = portfolio.map(p => p.symbol);
    const data = portfolio.map(p => {
        const stock = marketData.find(s => s.symbol === p.symbol);
        return p.qty * (stock ? stock.price : p.avgPrice);
    });
    
    // Generate colors dynamically
    const colors = labels.map((_, i) => `hsl(${(i * 360) / labels.length}, 70%, 50%)`);

    portfolioChartInstance.data.labels = labels;
    portfolioChartInstance.data.datasets[0].data = data;
    portfolioChartInstance.data.datasets[0].backgroundColor = colors;
    portfolioChartInstance.update();
}

function updateChartsTheme(isDark) {
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#333333' : '#e2e8f0';

    if (marketChartInstance) {
        marketChartInstance.options.scales.x.grid.color = gridColor;
        marketChartInstance.options.scales.y.grid.color = gridColor;
        marketChartInstance.options.scales.x.ticks.color = textColor;
        marketChartInstance.options.scales.y.ticks.color = textColor;
        marketChartInstance.update();
    }
    if (portfolioChartInstance) {
        portfolioChartInstance.options.plugins.legend.labels.color = textColor;
        portfolioChartInstance.update();
    }
}

// --- 10. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderStocksGrid();
    renderWatchlist();
    initCharts();
    renderPortfolio(); // Will trigger chart update
});
