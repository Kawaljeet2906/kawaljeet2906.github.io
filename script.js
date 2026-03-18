/* ============================================================
   MARKETPULSE — SCRIPT.JS
   ============================================================ */

'use strict';

/* ─── Mock Data ──────────────────────────────────────────── */

const INDICES = {
  nifty:     { name: 'NIFTY 50',    price: 22147.90, change: 142.35,  pct: 0.65  },
  sensex:    { name: 'SENSEX',      price: 73088.33, change: 398.12,  pct: 0.55  },
  banknifty: { name: 'BANK NIFTY', price: 47321.55,  change: -213.80, pct: -0.45 }
};

const STOCKS = [
  { sym:'RELIANCE',  name:'Reliance Industries',   price:2947.35, chg:1.24  },
  { sym:'TCS',       name:'Tata Consultancy Svc',  price:3821.10, chg:0.87  },
  { sym:'HDFCBANK',  name:'HDFC Bank',              price:1542.75, chg:-0.53 },
  { sym:'INFY',      name:'Infosys',                price:1456.20, chg:2.11  },
  { sym:'ICICIBANK', name:'ICICI Bank',             price:1198.60, chg:-1.04 },
  { sym:'HINDUNILVR',name:'Hindustan Unilever',     price:2312.40, chg:0.33  },
  { sym:'SBIN',      name:'State Bank of India',    price:792.15,  chg:1.89  },
  { sym:'BAJFINANCE',name:'Bajaj Finance',          price:6823.50, chg:-2.14 },
  { sym:'KOTAKBANK', name:'Kotak Mahindra Bank',    price:1721.30, chg:0.61  },
  { sym:'BHARTIARTL',name:'Bharti Airtel',          price:1382.90, chg:3.42  },
  { sym:'LT',        name:'Larsen & Toubro',        price:3504.60, chg:0.95  },
  { sym:'ITC',       name:'ITC Limited',            price:488.25,  chg:0.72  },
  { sym:'AXISBANK',  name:'Axis Bank',              price:1089.45, chg:-0.87 },
  { sym:'ASIANPAINT',name:'Asian Paints',           price:2841.70, chg:-1.32 },
  { sym:'MARUTI',    name:'Maruti Suzuki',          price:12087.50,chg:1.56  },
  { sym:'WIPRO',     name:'Wipro',                  price:478.35,  chg:1.02  },
  { sym:'ULTRACEMCO',name:'UltraTech Cement',       price:10423.80,chg:0.44  },
  { sym:'NESTLEIND', name:'Nestle India',           price:2315.60, chg:-0.28 },
  { sym:'TITAN',     name:'Titan Company',          price:3572.90, chg:2.78  },
  { sym:'POWERGRID', name:'Power Grid Corp',        price:312.45,  chg:0.91  },
  { sym:'NTPC',      name:'NTPC',                   price:368.70,  chg:1.14  },
  { sym:'ONGC',      name:'ONGC',                   price:274.30,  chg:-0.63 },
  { sym:'TATASTEEL', name:'Tata Steel',             price:163.85,  chg:2.05  },
  { sym:'JSWSTEEL',  name:'JSW Steel',              price:872.40,  chg:1.67  },
  { sym:'SUNPHARMA', name:'Sun Pharmaceutical',     price:1621.35, chg:0.38  },
  { sym:'DRREDDY',   name:"Dr. Reddy's Lab",        price:5783.20, chg:-0.94 },
  { sym:'CIPLA',     name:'Cipla',                  price:1392.60, chg:1.22  },
  { sym:'DIVISLAB',  name:"Divi's Laboratories",    price:3841.75, chg:-1.56 },
  { sym:'BPCL',      name:'BPCL',                   price:614.20,  chg:0.83  },
  { sym:'COALINDIA', name:'Coal India',             price:478.90,  chg:0.54  },
  { sym:'GRASIM',    name:'Grasim Industries',      price:2213.40, chg:-0.71 },
  { sym:'HINDALCO',  name:'Hindalco Industries',    price:612.75,  chg:1.48  },
  { sym:'TECHM',     name:'Tech Mahindra',          price:1298.50, chg:2.37  },
  { sym:'HCLTECH',   name:'HCL Technologies',       price:1547.30, chg:0.66  },
  { sym:'M&M',       name:'Mahindra & Mahindra',    price:2148.60, chg:3.11  },
  { sym:'BAJAJFINSV',name:'Bajaj Finserv',          price:1582.30, chg:-1.23 },
  { sym:'ADANIPORTS',name:'Adani Ports',            price:1342.80, chg:1.89  },
  { sym:'ADANIENT',  name:'Adani Enterprises',      price:2892.40, chg:-2.67 },
  { sym:'APOLLOHOSP',name:'Apollo Hospitals',       price:6821.50, chg:0.93  },
  { sym:'PIDILITIND',name:'Pidilite Industries',    price:2943.70, chg:0.47  },
  { sym:'GODREJCP',  name:'Godrej Consumer Products',price:1187.30,chg:-0.38 },
  { sym:'BERGEPAINT',name:'Berger Paints',          price:482.60,  chg:-1.02 },
  { sym:'DABUR',     name:'Dabur India',            price:518.40,  chg:0.29  },
  { sym:'MARICO',    name:'Marico',                 price:612.80,  chg:0.75  },
  { sym:'EICHERMOT', name:'Eicher Motors',          price:4512.30, chg:1.34  },
  { sym:'HEROMOTOCO',name:'Hero MotoCorp',          price:5123.80, chg:-0.87 },
  { sym:'BAJAJ-AUTO',name:'Bajaj Auto',             price:8921.40, chg:2.15  },
  { sym:'TATACONSUM',name:'Tata Consumer Products', price:982.60,  chg:0.62  },
  { sym:'INDUSINDBK',name:'IndusInd Bank',          price:1421.30, chg:-1.54 },
  { sym:'BRITANNIA', name:'Britannia Industries',   price:5234.70, chg:0.88  }
];

/* Generate fake intraday time labels */
function genTimeLabels() {
  const labels = [];
  for (let h = 9; h <= 15; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 15 && m > 30) break;
      labels.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    }
  }
  return labels;
}

function randWalk(start, len, volatility) {
  const arr = [start];
  for (let i = 1; i < len; i++) {
    const delta = (Math.random() - 0.48) * volatility;
    arr.push(+(arr[i-1] + delta).toFixed(2));
  }
  return arr;
}

const TIME_LABELS = genTimeLabels();

/* ─── State ───────────────────────────────────────────────── */
let portfolio  = JSON.parse(localStorage.getItem('mp_portfolio')  || '[]');
let watchlist  = JSON.parse(localStorage.getItem('mp_watchlist')  || '[]');
let pieChartInst = null;
let trendChartInst = null;

/* ─── Utilities ───────────────────────────────────────────── */
const fmt = (n) => new Intl.NumberFormat('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n);
const fmtINR = (n) => `₹${fmt(Math.abs(n))}`;
const sign = (n) => n >= 0 ? '+' : '-';

function toast(msg, type = 'green') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.className = `toast ${type}`;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

/* ─── Theme ───────────────────────────────────────────────── */
function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('mp_theme', t);
  const icon = t === 'dark' ? '☀' : '☾';
  document.getElementById('themeIcon').textContent = icon;
  document.getElementById('themeIconMobile').textContent = icon;
  rebuildCharts();
}

function initTheme() {
  const saved = localStorage.getItem('mp_theme') || 'dark';
  applyTheme(saved);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
});
document.getElementById('themeToggleMobile').addEventListener('click', () => {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

/* ─── Sidebar Nav ─────────────────────────────────────────── */
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${id}`).classList.add('active');
  document.querySelector(`[data-section="${id}"]`).classList.add('active');
  closeSidebar();
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    showSection(item.dataset.section);
  });
});

/* Mobile sidebar */
const sidebar  = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

let overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

/* ─── Chart helpers ───────────────────────────────────────── */
function chartColors() {
  const dark = getTheme() === 'dark';
  return {
    grid:  dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    tick:  dark ? '#4a566a' : '#8a96a8',
    tooltip: dark ? '#161c2a' : '#ffffff'
  };
}

function makeMiniChart(canvasId, data, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const gradient = ctx.createLinearGradient(0,0,0,60);
  gradient.addColorStop(0, color + '33');
  gradient.addColorStop(1, color + '00');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: TIME_LABELS,
      datasets: [{ data, borderColor: color, backgroundColor: gradient,
        borderWidth: 1.5, tension: 0.4, pointRadius: 0, fill: true }]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function makeTrendChart() {
  const c = chartColors();
  const ctx = document.getElementById('trendChart').getContext('2d');
  const niftyData = randWalk(22000, TIME_LABELS.length, 40);
  const sensexData = randWalk(72800, TIME_LABELS.length, 130);
  const bankData  = randWalk(47500, TIME_LABELS.length, 80);

  if (trendChartInst) trendChartInst.destroy();

  trendChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: TIME_LABELS,
      datasets: [
        { label:'NIFTY 50',    data: niftyData,  borderColor:'#00d4aa', backgroundColor:'transparent', borderWidth:2, tension:0.4, pointRadius:0 },
        { label:'SENSEX',      data: sensexData, borderColor:'#ff6b6b', backgroundColor:'transparent', borderWidth:2, tension:0.4, pointRadius:0, yAxisID:'y2' },
        { label:'BANK NIFTY',  data: bankData,   borderColor:'#ffa94d', backgroundColor:'transparent', borderWidth:2, tension:0.4, pointRadius:0, yAxisID:'y3' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: c.tooltip,
          titleColor: '#7d8fa8',
          bodyColor: '#e8edf8',
          borderColor: '#232c3e',
          borderWidth: 1
        }
      },
      scales: {
        x: { grid:{ color: c.grid }, ticks:{ color: c.tick, maxTicksLimit:8, font:{size:11} } },
        y:  { display:true,  position:'left',  grid:{ color: c.grid }, ticks:{ color:'#00d4aa', font:{size:10} } },
        y2: { display:false },
        y3: { display:false }
      }
    }
  });
}

function makePieChart() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (pieChartInst) pieChartInst.destroy();

  if (!portfolio.length) {
    pieChartInst = new Chart(ctx, {
      type:'doughnut',
      data:{ labels:['No Holdings'], datasets:[{ data:[1], backgroundColor:['#232c3e'], borderWidth:0 }] },
      options:{ plugins:{ legend:{ display:false }, tooltip:{ enabled:false } }, cutout:'60%' }
    });
    return;
  }

  const colors = ['#00d4aa','#ff6b6b','#ffa94d','#4d9fff','#9d7fff','#ff9de2','#a9c4ff','#7afcb7','#ffcd80','#ff7f9e'];
  const labels = portfolio.map(p => p.sym);
  const values = portfolio.map(p => p.qty * p.buyPrice);

  const c = chartColors();

  pieChartInst = new Chart(ctx, {
    type:'doughnut',
    data:{
      labels,
      datasets:[{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: c.tooltip
      }]
    },
    options:{
      responsive:true,
      cutout:'60%',
      plugins:{
        legend:{ position:'bottom', labels:{ color: chartColors().tick, font:{size:11}, boxWidth:12, padding:10 } },
        tooltip:{ backgroundColor: c.tooltip, bodyColor:'#e8edf8', borderColor:'#232c3e', borderWidth:1 }
      }
    }
  });
}

function rebuildCharts() {
  // Mini charts
  if (window._niftyChart)     window._niftyChart.destroy();
  if (window._sensexChart)    window._sensexChart.destroy();
  if (window._bankniftyChart) window._bankniftyChart.destroy();

  window._niftyChart     = makeMiniChart('chart-nifty',     randWalk(22000, TIME_LABELS.length, 40),  '#00d4aa');
  window._sensexChart    = makeMiniChart('chart-sensex',    randWalk(72800, TIME_LABELS.length, 130), '#4d9fff');
  window._bankniftyChart = makeMiniChart('chart-banknifty', randWalk(47500, TIME_LABELS.length, 80),  '#ff6b6b');

  makeTrendChart();
  makePieChart();
}

/* ─── Dashboard ───────────────────────────────────────────── */
function initDashboard() {
  // Top gainers & losers
  const sorted = [...STOCKS].sort((a,b) => b.chg - a.chg);
  const gainers = sorted.slice(0,5);
  const losers  = sorted.slice(-5).reverse();

  function renderMovers(listId, data) {
    const el = document.getElementById(listId);
    el.innerHTML = data.map(s => `
      <div class="mover-item">
        <div>
          <div class="mover-name">${s.name}</div>
          <div class="mover-sym">${s.sym}</div>
        </div>
        <div class="mover-right">
          <div class="mover-price">₹${fmt(s.price)}</div>
          <div class="mover-pct ${s.chg>=0?'positive':'negative'}">${s.chg>=0?'▲':'▼'} ${Math.abs(s.chg).toFixed(2)}%</div>
        </div>
      </div>`).join('');
  }

  renderMovers('topGainers', gainers);
  renderMovers('topLosers', losers);
}

/* ─── Stocks Grid ─────────────────────────────────────────── */
function renderStocksGrid(filter='', containerId='stocksGrid') {
  const grid = document.getElementById(containerId);
  const data = STOCKS.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.sym.toLowerCase().includes(filter.toLowerCase())
  );

  grid.innerHTML = data.map(s => {
    const inWatch = watchlist.includes(s.sym);
    return `
    <div class="stock-card" data-sym="${s.sym}">
      <div class="stock-sym">${s.sym}</div>
      <div class="stock-name">${s.name}</div>
      <div class="stock-price">₹${fmt(s.price)}</div>
      <div class="stock-change ${s.chg>=0?'positive':'negative'}">${s.chg>=0?'▲':'▼'} ${Math.abs(s.chg).toFixed(2)}%</div>
      <button class="watch-btn ${inWatch?'active':''}" data-sym="${s.sym}" title="${inWatch?'Remove from watchlist':'Add to watchlist'}">
        ${inWatch?'★':'☆'}
      </button>
    </div>`;
  }).join('');

  // Watch button handlers
  grid.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWatch(btn.dataset.sym);
      renderStocksGrid(document.getElementById('stockSearch').value);
      renderWatchlist();
    });
  });
}

document.getElementById('stockSearch').addEventListener('input', e => {
  renderStocksGrid(e.target.value);
});

/* ─── Watchlist ───────────────────────────────────────────── */
function toggleWatch(sym) {
  const idx = watchlist.indexOf(sym);
  if (idx === -1) {
    watchlist.push(sym);
    toast(`${sym} added to watchlist ★`, 'green');
  } else {
    watchlist.splice(idx, 1);
    toast(`${sym} removed from watchlist`, 'red');
  }
  localStorage.setItem('mp_watchlist', JSON.stringify(watchlist));
}

function renderWatchlist() {
  const grid  = document.getElementById('watchlistGrid');
  const empty = document.getElementById('watchlistEmpty');

  if (!watchlist.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  const data = STOCKS.filter(s => watchlist.includes(s.sym));

  grid.innerHTML = data.map(s => `
    <div class="stock-card" data-sym="${s.sym}">
      <div class="stock-sym">${s.sym}</div>
      <div class="stock-name">${s.name}</div>
      <div class="stock-price">₹${fmt(s.price)}</div>
      <div class="stock-change ${s.chg>=0?'positive':'negative'}">${s.chg>=0?'▲':'▼'} ${Math.abs(s.chg).toFixed(2)}%</div>
      <button class="watch-btn active" data-sym="${s.sym}" title="Remove from watchlist">★</button>
    </div>`).join('');

  grid.querySelectorAll('.watch-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWatch(btn.dataset.sym);
      renderWatchlist();
      renderStocksGrid(document.getElementById('stockSearch').value);
    });
  });
}

/* Watch search */
const watchSearch = document.getElementById('watchSearch');
const watchSugg   = document.getElementById('watchSuggestions');

watchSearch.addEventListener('input', () => {
  const q = watchSearch.value.trim().toLowerCase();
  if (!q) { watchSugg.style.display='none'; return; }

  const matches = STOCKS.filter(s =>
    (s.name.toLowerCase().includes(q) || s.sym.toLowerCase().includes(q)) &&
    !watchlist.includes(s.sym)
  ).slice(0,6);

  if (!matches.length) { watchSugg.style.display='none'; return; }

  watchSugg.style.display = 'block';
  watchSugg.innerHTML = matches.map(s => `
    <div class="watch-sugg-item" data-sym="${s.sym}">
      <div>
        <strong>${s.sym}</strong> <span style="color:var(--text-muted);font-size:12px">${s.name}</span>
      </div>
      <button class="sugg-add-btn" data-sym="${s.sym}">+ Add</button>
    </div>`).join('');

  watchSugg.querySelectorAll('.sugg-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWatch(btn.dataset.sym);
      watchSearch.value = '';
      watchSugg.style.display = 'none';
      renderWatchlist();
    });
  });
});

document.addEventListener('click', e => {
  if (!watchSearch.contains(e.target) && !watchSugg.contains(e.target)) {
    watchSugg.style.display = 'none';
  }
});

/* ─── Portfolio ───────────────────────────────────────────── */
function savePortfolio() {
  localStorage.setItem('mp_portfolio', JSON.stringify(portfolio));
}

function calcPortfolioStats() {
  let invested = 0, current = 0;
  portfolio.forEach(h => {
    invested += h.qty * h.buyPrice;
    current  += h.qty * h.currPrice;
  });
  const pnl     = current - invested;
  const returns = invested ? (pnl / invested) * 100 : 0;
  return { invested, current, pnl, returns };
}

function renderPortfolio() {
  const tbody  = document.getElementById('holdingsTbody');
  const empty  = document.getElementById('holdingsEmpty');
  const stats  = calcPortfolioStats();

  // Stats
  document.getElementById('totalInvested').textContent  = fmtINR(stats.invested);
  document.getElementById('currentValue').textContent   = fmtINR(stats.current);

  const pnlEl = document.getElementById('pnlValue');
  pnlEl.textContent = `${stats.pnl >= 0 ? '+' : '-'}${fmtINR(stats.pnl)}`;
  pnlEl.style.color = stats.pnl >= 0 ? 'var(--positive)' : 'var(--negative)';

  const retEl = document.getElementById('returnsPercent');
  retEl.textContent = `${stats.returns >= 0 ? '+' : ''}${stats.returns.toFixed(2)}%`;
  retEl.style.color = stats.returns >= 0 ? 'var(--positive)' : 'var(--negative)';

  // Table
  if (!portfolio.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    makePieChart();
    return;
  }

  empty.style.display = 'none';

  tbody.innerHTML = portfolio.map((h, i) => {
    const inv = h.qty * h.buyPrice;
    const val = h.qty * h.currPrice;
    const pnl = val - inv;
    const pct = ((pnl / inv) * 100).toFixed(2);
    return `
    <tr>
      <td><div class="td-name">${h.name}</div><div class="td-sym">${h.sym}</div></td>
      <td>${h.qty}</td>
      <td>₹${fmt(h.buyPrice)}</td>
      <td>₹${fmt(h.currPrice)}</td>
      <td>₹${fmt(inv)}</td>
      <td>₹${fmt(val)}</td>
      <td class="td-pnl ${pnl>=0?'positive':'negative'}">${pnl>=0?'+':'-'}₹${fmt(Math.abs(pnl))}<br><small>${pnl>=0?'+':''}${pct}%</small></td>
      <td><button class="del-btn" data-idx="${i}">✕ Remove</button></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.idx;
      const sym = portfolio[idx].sym;
      portfolio.splice(idx, 1);
      savePortfolio();
      renderPortfolio();
      toast(`${sym} removed from portfolio`, 'red');
    });
  });

  makePieChart();
}

document.getElementById('addStockBtn').addEventListener('click', () => {
  const name      = document.getElementById('pName').value.trim();
  const sym       = document.getElementById('pSymbol').value.trim().toUpperCase();
  const buyPrice  = parseFloat(document.getElementById('pBuyPrice').value);
  const qty       = parseInt(document.getElementById('pQty').value);
  const currPrice = parseFloat(document.getElementById('pCurrPrice').value);

  if (!name || !sym || isNaN(buyPrice) || isNaN(qty) || isNaN(currPrice) || qty < 1 || buyPrice <= 0 || currPrice <= 0) {
    toast('Please fill all fields correctly', 'red');
    return;
  }

  portfolio.push({ name, sym, buyPrice, qty, currPrice });
  savePortfolio();
  renderPortfolio();
  toast(`${sym} added to portfolio ✓`, 'green');

  // Reset form
  ['pName','pSymbol','pBuyPrice','pQty','pCurrPrice'].forEach(id => document.getElementById(id).value = '');
});

/* ─── Live ticker simulation ──────────────────────────────── */
function tickPrices() {
  STOCKS.forEach(s => {
    const delta = (Math.random() - 0.49) * s.price * 0.0008;
    s.price = Math.max(1, +(s.price + delta).toFixed(2));
    const dayOpen = s.price / (1 + s.chg / 100);
    s.chg = +(((s.price - dayOpen) / dayOpen) * 100).toFixed(2);
  });

  // Update index cards lightly
  const niftyDelta    = (Math.random() - 0.49) * 5;
  const sensexDelta   = (Math.random() - 0.49) * 15;
  const bankniftyDelta= (Math.random() - 0.49) * 10;

  INDICES.nifty.price     = +(INDICES.nifty.price + niftyDelta).toFixed(2);
  INDICES.sensex.price    = +(INDICES.sensex.price + sensexDelta).toFixed(2);
  INDICES.banknifty.price = +(INDICES.banknifty.price + bankniftyDelta).toFixed(2);

  updateIndexCards();

  // Re-render stocks grid if visible
  const activeSection = document.querySelector('.section.active');
  if (activeSection && activeSection.id === 'section-stocks') {
    renderStocksGrid(document.getElementById('stockSearch').value);
  }
  if (activeSection && activeSection.id === 'section-watchlist') {
    renderWatchlist();
  }
}

function updateIndexCards() {
  ['nifty','sensex','banknifty'].forEach(key => {
    const idx  = INDICES[key];
    const pEl  = document.getElementById(`${key}-price`);
    const cEl  = document.getElementById(`${key}-change`);
    if (!pEl) return;
    pEl.textContent = fmt(idx.price);
    const isPos = idx.change >= 0;
    cEl.textContent = `${isPos?'▲':'▼'} ${fmt(Math.abs(idx.change))} (${Math.abs(idx.pct).toFixed(2)}%)`;
    cEl.className = `index-change ${isPos?'positive':'negative'}`;
  });
}

/* ─── Init ────────────────────────────────────────────────── */
function init() {
  initTheme();
  initDashboard();
  rebuildCharts();
  renderStocksGrid();
  renderPortfolio();
  renderWatchlist();

  // Simulate live data every 3 seconds
  setInterval(tickPrices, 3000);
}

document.addEventListener('DOMContentLoaded', init);
