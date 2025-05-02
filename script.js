// script.js for Crypto P2P Marketplace UI
console.log('Crypto P2P Marketplace UI loaded.');

// --- WALLET LOGIC (persistent with localStorage) ---
const DEFAULT_WALLET = {
  UAH: 50000.00,
  USD: 5000.00,
  USDT: 0.00,
  BTC: 0.00000000,
  ETH: 0.00000000
};

function ensureWalletStructure(wallet) {
  let changed = false;
  for (const key in DEFAULT_WALLET) {
    if (!(key in wallet)) {
      wallet[key] = DEFAULT_WALLET[key];
      changed = true;
    }
  }
  return changed ? { ...wallet } : wallet;
}

function getWallet() {
  const stored = localStorage.getItem('wallet');
  let wallet;
  if (stored) {
    try {
      wallet = JSON.parse(stored);
    } catch (e) {
      wallet = { ...DEFAULT_WALLET };
    }
  } else {
    wallet = { ...DEFAULT_WALLET };
  }
  // Ensure all currencies exist
  const fixedWallet = ensureWalletStructure(wallet);
  if (JSON.stringify(wallet) !== JSON.stringify(fixedWallet)) {
    setWallet(fixedWallet);
    return fixedWallet;
  }
  return wallet;
}

function setWallet(newWallet) {
  localStorage.setItem('wallet', JSON.stringify(newWallet));
  updateWalletUI();
}
function updateWalletUI() {
  const wallet = getWallet();
  if (document.getElementById('wallet-uah'))
    document.getElementById('wallet-uah').textContent = wallet.UAH.toFixed(2) + ' UAH';
  if (document.getElementById('wallet-usd'))
    document.getElementById('wallet-usd').textContent = wallet.USD.toFixed(2) + ' USD';
  if (document.getElementById('wallet-usdt'))
    document.getElementById('wallet-usdt').textContent = wallet.USDT.toFixed(2) + ' USDT';
  if (document.getElementById('wallet-btc'))
    document.getElementById('wallet-btc').textContent = wallet.BTC.toFixed(8) + ' BTC';
  if (document.getElementById('wallet-eth'))
    document.getElementById('wallet-eth').textContent = wallet.ETH.toFixed(8) + ' ETH';
}
window.getWallet = getWallet;
window.setWallet = setWallet;
window.updateWalletUI = updateWalletUI;
document.addEventListener('DOMContentLoaded', updateWalletUI);

// --- END WALLET LOGIC ---

let tradeMode = 'buy'; // 'buy' or 'sell'
let selectedCrypto = 'USDT';

const UAHtoUSD = 41.85; // Приблизний курс для конвертації

// 1. Merchant data array
const merchants = [
  // Merchants from latest screenshot
  {
    avatar: 'N',
    name: 'Nikita_Str',
    verified: true,
    online: true,
    orders: 123,
    completion: 98.40,
    price: 41.88,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 720.7107,
    availableCurrency: 'USDT',
    limitMin: 15000,
    limitMax: 49083.36,
    payment: ['Monobank', 'ПУМБ', 'A-Банк'],
    recommended: false
  },
  {
    avatar: 'E',
    name: 'Enigmanik',
    verified: false,
    online: true,
    orders: 118,
    completion: 100.00,
    price: 41.88,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 846.4662,
    availableCurrency: 'USDT',
    limitMin: 4000,
    limitMax: 35450,
    payment: ['Monobank', 'Izibank', 'ПУМБ'],
    recommended: false
  },
  {
    avatar: 'B',
    name: 'Bolgarochkaaa',
    verified: false,
    online: true,
    orders: 41,
    completion: 100.00,
    price: 41.89,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 768.7206,
    availableCurrency: 'USDT',
    limitMin: 3000,
    limitMax: 32171,
    payment: ['Monobank', 'ПУМБ', 'A-Банк'],
    recommended: false
  },
  {
    avatar: 'M',
    name: 'Marmalade',
    verified: false,
    online: true,
    orders: 26,
    completion: 100.00,
    price: 41.9,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 123.5417,
    availableCurrency: 'USDT',
    limitMin: 5000,
    limitMax: 5176,
    payment: ['Monobank'],
    recommended: false
  },
  {
    avatar: 'F',
    name: 'Fast.obmen',
    verified: false,
    online: true,
    orders: 24,
    completion: 100.00,
    price: 41.9,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 101.9148,
    availableCurrency: 'USDT',
    limitMin: 4000,
    limitMax: 19000,
    payment: ['Monobank', 'ПУМБ', 'A-Банк'],
    recommended: false
  },
  // New merchants from screenshot
  {
    avatar: 'G',
    name: 'Gevol',
    verified: false,
    online: true,
    orders: 39,
    completion: 100.00,
    price: 41.85,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 896.73,
    availableCurrency: 'USDT',
    limitMin: 4000,
    limitMax: 37528.15,
    payment: ['ПУМБ', 'Monobank', 'Sense SuperApp'],
    recommended: false
  },
  {
    avatar: 'B',
    name: 'Blackrigden',
    verified: false,
    online: true,
    orders: 50,
    completion: 100.00,
    price: 41.86,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 329.4637,
    availableCurrency: 'USDT',
    limitMin: 3500,
    limitMax: 13770,
    payment: ['Sense SuperApp'],
    recommended: false
  },
  {
    avatar: 'S',
    name: 'swagEXCHENGE',
    verified: false,
    online: true,
    orders: 5,
    completion: 100.00,
    price: 41.86,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 305.4218,
    availableCurrency: 'USDT',
    limitMin: 3000,
    limitMax: 12784,
    payment: ['Monobank', 'ПУМБ', 'Ощадбанк'],
    recommended: false
  },
  {
    avatar: 'S',
    name: 'Satoshi Exchange',
    verified: false,
    online: true,
    orders: 34,
    completion: 100.00,
    price: 41.87,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 410,
    availableCurrency: 'USDT',
    limitMin: 4000,
    limitMax: 17166,
    payment: ['ПУМБ', 'A-Банк', 'Monobank'],
    recommended: false
  },
  {
    avatar: 'D',
    name: 'DeamonP2P',
    verified: true,
    online: true,
    orders: 419,
    completion: 99.52,
    price: 43.05,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 2127.762,
    availableCurrency: 'USDT',
    limitMin: 6000,
    limitMax: 91500,
    payment: ['ПУМБ', 'A-Банк', 'Izibank'],
    recommended: true
  },
  {
    avatar: 'C',
    name: 'Common-User-047653824574',
    verified: false,
    online: false,
    orders: 4,
    completion: 100,
    price: 41.8,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 100,
    availableCurrency: 'USDT',
    limitMin: 4100,
    limitMax: 4100,
    payment: ['ПриватБанк'],
    recommended: false
  },
  {
    avatar: 'R',
    name: 'Retro888',
    verified: true,
    online: true,
    orders: 25,
    completion: 100,
    price: 41.94,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 100.9409,
    availableCurrency: 'USDT',
    limitMin: 3000,
    limitMax: 3000,
    payment: ['ПриватБанк'],
    recommended: false
  },
  {
    avatar: '1',
    name: '1kand',
    verified: false,
    online: false,
    orders: 78,
    completion: 98.73,
    price: 41.95,
    priceUSD: 1.00,
    currency: 'UAH',
    available: 571.5251,
    availableCurrency: 'USDT',
    limitMin: 12000,
    limitMax: 23975,
    payment: ['Monobank', 'Sense SuperApp', 'ПУМБ'],
    recommended: false
  }
];

// 2. Render function
function renderMerchants(list) {
  const container = document.getElementById('merchant-list');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<div style="color: #aeb4c0; padding: 24px; text-align:center;">Нічого не знайдено</div>';
    return;
  }
  // Визначаємо валюту для відображення
  const selectedCurrency = document.getElementById('currency-filter')?.value || 'UAH';
  container.innerHTML = list.map((m, idx) => {
    let price = m.price;
    let priceLabel = 'UAH';
    let limitMin = m.limitMin;
    let limitMax = m.limitMax;
    if (selectedCurrency === 'USD') {
      price = (m.price / UAHtoUSD).toFixed(2);
      priceLabel = 'USD';
      limitMin = (m.limitMin / UAHtoUSD).toFixed(2);
      limitMax = (m.limitMax / UAHtoUSD).toFixed(2);
    }
    return `
    <div class="merchant${m.verified ? ' verified-merchant' : ''}${m.recommended ? ' recommended' : ''}">
      <div class="avatar">${m.avatar}</div>
      <div class="info">
        <div class="name">${m.name} ${m.verified ? '<span class=\"verified\"></span>' : ''}</div>
        <div class="stats">${m.orders} ордери | ${m.completion.toFixed(2)}% Завершення</div>
      </div>
      <div class="price">${price} <span>${priceLabel}</span></div>
      <div class="limits">
        <div>Доступно: <b>${m.available} ${m.availableCurrency}</b></div>
        <div>Ліміт: ${limitMin} - ${limitMax} ${priceLabel}</div>
      </div>
      <div class="payments">
        ${m.payment.map(p => `<span>${p}</span>`).join(' ')}
      </div>
      <button class="trade-btn ${tradeMode === 'buy' ? 'buy' : 'sell'}" data-merchant-idx="${idx}">${tradeMode === 'buy' ? 'Купівля ' + selectedCrypto : 'Продати ' + selectedCrypto}</button>
    </div>
    `;
  }).join('');
  // Add event listeners for trade buttons
  document.querySelectorAll('.trade-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = btn.getAttribute('data-merchant-idx');
      const merchant = list[idx];
      if (tradeMode === 'buy') {
        openPurchaseModal(merchant);
      } else {
        openSellModal(merchant);
      }
    });
  });
}

function getCurrentFilters() {
  return {
    amount: document.getElementById('amount-filter')?.value,
    currency: document.getElementById('currency-filter')?.value,
    payment: document.getElementById('payment-filter')?.value,
    dealer: document.getElementById('dealer-filter')?.value.trim(),
    sort: document.getElementById('sort-filter')?.value
  };
}

function renderMerchantsForCurrentState() {
  // Показуємо всіх merchant'ів для вибраної криптовалюти (USDT, BTC, ETH, ...)
  let filtered = merchants.filter(m => m.availableCurrency === selectedCrypto);
  filtered = filterMerchants(filtered, getCurrentFilters());
  renderMerchants(filtered);
}

function filterMerchants(list, filters) {
  let filtered = [...list];
  // Amount filter
  const amount = parseFloat(filters.amount);
  if (!isNaN(amount)) {
    filtered = filtered.filter(m => amount >= m.limitMin && amount <= m.limitMax);
  }
  // Payment filter
  if (filters.payment) {
    filtered = filtered.filter(m => m.payment.includes(filters.payment));
  }
  // Dealer filter
  if (filters.dealer) {
    filtered = filtered.filter(m => m.name.toLowerCase().includes(filters.dealer.toLowerCase()));
  }
  // Sorting
  if (filters.sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'available-desc') {
    filtered.sort((a, b) => b.available - a.available);
  } else if (filters.sort === 'completion-desc') {
    filtered.sort((a, b) => b.completion - a.completion);
  } else if (filters.sort === 'completion-asc') {
    filtered.sort((a, b) => a.completion - b.completion);
  }
  return filtered;
}

// Enable live filtering
['amount-filter', 'currency-filter', 'payment-filter', 'dealer-filter', 'sort-filter'].forEach(id => {
  if (document.getElementById(id)) {
    document.getElementById(id).oninput = renderMerchantsForCurrentState;
    document.getElementById(id).onchange = renderMerchantsForCurrentState;
  }
});

// Crypto tab switching
const cryptoTabs = document.querySelectorAll('.crypto');
cryptoTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    cryptoTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    selectedCrypto = this.textContent.trim();
    renderMerchantsForCurrentState();
  });
});

// Tab switching logic
if (document.getElementById('buy-tab') && document.getElementById('sell-tab')) {
  document.getElementById('buy-tab').onclick = function() {
    tradeMode = 'buy';
    document.getElementById('buy-tab').classList.add('active');
    document.getElementById('sell-tab').classList.remove('active');
    renderMerchantsForCurrentState();
  };
  document.getElementById('sell-tab').onclick = function() {
    tradeMode = 'sell';
    document.getElementById('sell-tab').classList.add('active');
    document.getElementById('buy-tab').classList.remove('active');
    renderMerchantsForCurrentState();
  };
}

// Initial render: show all for selected crypto
renderMerchantsForCurrentState();

// 6. Modal logic
let currentMerchant = null;
function openPurchaseModal(merchant) {
  currentMerchant = merchant;
  document.getElementById('purchase-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Fill merchant info
  document.getElementById('modal-avatar').textContent = merchant.avatar;
  document.getElementById('modal-merchant-name').innerHTML = merchant.name + (merchant.verified ? ' <span class="verified"></span>' : '');
  document.getElementById('modal-merchant-status').textContent = merchant.online ? 'Online' : 'Offline';
  document.getElementById('modal-merchant-status').className = 'modal-merchant-status' + (merchant.online ? '' : ' offline');
  document.getElementById('modal-merchant-orders').textContent = merchant.orders + ' ордери';
  document.getElementById('modal-merchant-completion').textContent = merchant.completion.toFixed(2) + '% Завершення';

  // Визначаємо валюту для модалки
  const selectedCurrency = document.getElementById('currency-filter')?.value || 'UAH';
  let price = merchant.price;
  let priceLabel = 'UAH';
  let limitMin = merchant.limitMin;
  let limitMax = merchant.limitMax;
  if (selectedCurrency === 'USD') {
    price = parseFloat((merchant.price / UAHtoUSD).toFixed(2));
    priceLabel = 'USD';
    limitMin = parseFloat((merchant.limitMin / UAHtoUSD).toFixed(2));
    limitMax = parseFloat((merchant.limitMax / UAHtoUSD).toFixed(2));
  }
  document.getElementById('modal-price').textContent = price + ' ' + priceLabel;
  document.getElementById('modal-available').textContent = merchant.available + ' ' + merchant.availableCurrency;
  document.getElementById('modal-limits').textContent = limitMin + ' - ' + limitMax + ' ' + priceLabel;
  document.getElementById('modal-limits-info').textContent = 'Обмеження: ' + limitMin + ' - ' + limitMax + ' ' + priceLabel;
  // Payment methods
  const paySel = document.getElementById('modal-payment-method');
  paySel.innerHTML = '';
  merchant.payment.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    paySel.appendChild(opt);
  });
  document.getElementById('modal-payments').innerHTML = merchant.payment.map(p => `<span>${p}</span>`).join(' ');
  // Reset form
  document.getElementById('modal-amount').value = '';
  document.getElementById('modal-usdt').value = '';
  // Change modal labels for buy
  document.querySelector('label[for="modal-amount"]').textContent = 'Ви сплачуєте';
  document.querySelector('label[for="modal-usdt"]').textContent = 'Ви отримаєте';
  document.querySelector('.modal-buy-btn').textContent = 'Купити ' + selectedCrypto;

  // Show balance
  const wallet = getWallet();
  let balance = 0;
  let balanceLabel = '';
  if (selectedCurrency === 'USD') {
    balance = wallet.USD;
    balanceLabel = 'USD';
  } else {
    balance = wallet.UAH;
    balanceLabel = 'UAH';
  }
  document.getElementById('modal-balance-info').innerHTML = `Ваш баланс: <b>${balance.toLocaleString(undefined, {maximumFractionDigits: 2})} ${balanceLabel}</b>`;

  // Max hint for buy
  let maxAmount = Math.min(limitMax, balance);
  document.getElementById('modal-max-hint').textContent = `Максимум для покупки: ${maxAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${balanceLabel}`;
  document.getElementById('modal-max-hint').onclick = function() {
    document.getElementById('modal-amount').value = maxAmount;
    document.getElementById('modal-amount').dispatchEvent(new Event('input'));
  };
  document.getElementById('modal-max-btn').onclick = function() {
    document.getElementById('modal-amount').value = maxAmount;
    document.getElementById('modal-amount').dispatchEvent(new Event('input'));
  };
}

function openSellModal(merchant) {
  currentMerchant = merchant;
  document.getElementById('purchase-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Fill merchant info
  document.getElementById('modal-avatar').textContent = merchant.avatar;
  document.getElementById('modal-merchant-name').innerHTML = merchant.name + (merchant.verified ? ' <span class="verified"></span>' : '');
  document.getElementById('modal-merchant-status').textContent = merchant.online ? 'Online' : 'Offline';
  document.getElementById('modal-merchant-status').className = 'modal-merchant-status' + (merchant.online ? '' : ' offline');
  document.getElementById('modal-merchant-orders').textContent = merchant.orders + ' ордери';
  document.getElementById('modal-merchant-completion').textContent = merchant.completion.toFixed(2) + '% Завершення';

  // Визначаємо валюту для модалки
  const selectedCurrency = document.getElementById('currency-filter')?.value || 'UAH';
  let price = merchant.price;
  let priceLabel = 'UAH';
  let limitMin = merchant.limitMin;
  let limitMax = merchant.limitMax;
  if (selectedCurrency === 'USD') {
    price = parseFloat((merchant.price / UAHtoUSD).toFixed(2));
    priceLabel = 'USD';
    limitMin = parseFloat((merchant.limitMin / UAHtoUSD).toFixed(2));
    limitMax = parseFloat((merchant.limitMax / UAHtoUSD).toFixed(2));
  }
  document.getElementById('modal-price').textContent = price + ' ' + priceLabel;
  document.getElementById('modal-available').textContent = merchant.available + ' ' + merchant.availableCurrency;
  document.getElementById('modal-limits').textContent = limitMin + ' - ' + limitMax + ' ' + priceLabel;
  document.getElementById('modal-limits-info').textContent = 'Обмеження: ' + limitMin + ' - ' + limitMax + ' ' + priceLabel;
  // Payment methods
  const paySel = document.getElementById('modal-payment-method');
  paySel.innerHTML = '';
  merchant.payment.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    paySel.appendChild(opt);
  });
  document.getElementById('modal-payments').innerHTML = merchant.payment.map(p => `<span>${p}</span>`).join(' ');
  // Reset form
  document.getElementById('modal-amount').value = '';
  document.getElementById('modal-usdt').value = '';
  // Change modal labels for sell
  document.querySelector('label[for="modal-amount"]').textContent = 'Ви продаєте';
  document.querySelector('label[for="modal-usdt"]').textContent = 'Ви отримаєте';
  document.querySelector('.modal-buy-btn').textContent = 'Продати ' + selectedCrypto;

  // Show balance (USDT)
  const wallet = getWallet();
  document.getElementById('modal-balance-info').innerHTML = `Ваш баланс: <b>${wallet.USDT.toLocaleString(undefined, {maximumFractionDigits: 2})} USDT</b>`;

  // Max hint for sell
  let maxUsdt = Math.min(merchant.available, wallet.USDT, (limitMax / price));
  document.getElementById('modal-max-hint').textContent = `Максимум для продажу: ${maxUsdt.toLocaleString(undefined, {maximumFractionDigits: 2})} USDT`;
  document.getElementById('modal-max-hint').onclick = function() {
    document.getElementById('modal-amount').value = maxUsdt;
    document.getElementById('modal-amount').dispatchEvent(new Event('input'));
  };
  document.getElementById('modal-max-btn').onclick = function() {
    document.getElementById('modal-amount').value = maxUsdt;
    document.getElementById('modal-amount').dispatchEvent(new Event('input'));
  };
}

if (document.getElementById('modal-close'))
  document.getElementById('modal-close').onclick = closePurchaseModal;
function closePurchaseModal() {
  document.getElementById('purchase-modal').style.display = 'none';
  document.body.style.overflow = '';
}
// Close modal on overlay click
window.onclick = function(event) {
  const modal = document.getElementById('purchase-modal');
  if (modal && event.target === modal) closePurchaseModal();
};
// Calculate USDT on amount input
const modalAmountInput = document.getElementById('modal-amount');
modalAmountInput && modalAmountInput.addEventListener('input', function() {
  if (!currentMerchant) return;
  const selectedCurrency = document.getElementById('currency-filter')?.value || 'UAH';
  let price = currentMerchant.price;
  let limitMin = currentMerchant.limitMin;
  let limitMax = currentMerchant.limitMax;
  if (selectedCurrency === 'USD') {
    price = parseFloat((currentMerchant.price / UAHtoUSD).toFixed(2));
    limitMin = parseFloat((currentMerchant.limitMin / UAHtoUSD).toFixed(2));
    limitMax = parseFloat((currentMerchant.limitMax / UAHtoUSD).toFixed(2));
  }
  const amount = parseFloat(this.value);
  let result = '';
  if (tradeMode === 'buy') {
    if (!isNaN(amount) && amount >= limitMin && amount <= limitMax) {
      result = (amount / price).toFixed(2);
      if (parseFloat(result) > currentMerchant.available) result = currentMerchant.available;
    }
  } else {
    // Sell mode: amount is USDT, result is UAH/USD
    if (!isNaN(amount) && amount > 0) {
      let maxUsdt = Math.min(currentMerchant.available, getWallet().USDT, (limitMax / price));
      if (amount > maxUsdt) {
        result = (maxUsdt * price).toFixed(2);
      } else {
        result = (amount * price).toFixed(2);
      }
    }
  }
  document.getElementById('modal-usdt').value = result;
});
// Prevent form submit
const purchaseForm = document.getElementById('purchase-form');
purchaseForm && purchaseForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!currentMerchant) return;
  const amount = parseFloat(document.getElementById('modal-amount').value);
  const result = parseFloat(document.getElementById('modal-usdt').value);
  const selectedCurrency = document.getElementById('currency-filter')?.value || 'UAH';
  let price = currentMerchant.price;
  let limitMin = currentMerchant.limitMin;
  let limitMax = currentMerchant.limitMax;
  if (selectedCurrency === 'USD') {
    price = parseFloat((currentMerchant.price / UAHtoUSD).toFixed(2));
    limitMin = parseFloat((currentMerchant.limitMin / UAHtoUSD).toFixed(2));
    limitMax = parseFloat((currentMerchant.limitMax / UAHtoUSD).toFixed(2));
  }
  const epsilon = 0.01;
  // Debug
  console.log('amount:', amount, 'limitMin:', limitMin, 'limitMax:', limitMax, 'result:', result);
  if (tradeMode === 'buy') {
    if (isNaN(amount) || isNaN(result) || amount < limitMin - epsilon || amount > limitMax + epsilon) {
      alert('Введіть коректну суму для покупки.');
      return;
    }
    let wallet = getWallet();
    if (selectedCurrency === 'USD') {
      if (wallet.USD < amount) {
        alert(`Недостатньо USD для покупки.\nВаш баланс: ${wallet.USD.toFixed(2)} USD\nПотрібно: ${amount.toFixed(2)} USD`);
        return;
      }
      wallet.USD -= amount;
    } else {
      if (wallet.UAH < amount) {
        alert(`Недостатньо UAH для покупки.\nВаш баланс: ${wallet.UAH.toFixed(2)} UAH\nПотрібно: ${amount.toFixed(2)} UAH`);
        return;
      }
      wallet.UAH -= amount;
    }
    wallet.USDT += result;
    setWallet(wallet);
    alert('Покупка оформлена!\nВаш новий баланс: ' + wallet.UAH.toFixed(2) + ' UAH, ' + wallet.USD.toFixed(2) + ' USD, ' + wallet.USDT.toFixed(2) + ' USDT');
    closePurchaseModal();
  } else {
    // Sell mode
    if (isNaN(amount) || isNaN(result) || amount <= 0) {
      alert('Введіть коректну суму для продажу.');
      return;
    }
    let wallet = getWallet();
    let maxUsdt = Math.min(currentMerchant.available, wallet.USDT, (limitMax / price));
    if (amount > maxUsdt) {
      alert(`Недостатньо USDT для продажу.\nВаш баланс: ${wallet.USDT.toFixed(2)} USDT\nМаксимум для продажу: ${maxUsdt.toFixed(2)} USDT`);
      return;
    }
    wallet.USDT -= amount;
    if (selectedCurrency === 'USD') {
      wallet.USD += result;
    } else {
      wallet.UAH += result;
    }
    setWallet(wallet);
    alert('Продаж оформлено!\nВаш новий баланс: ' + wallet.UAH.toFixed(2) + ' UAH, ' + wallet.USD.toFixed(2) + ' USD, ' + wallet.USDT.toFixed(2) + ' USDT');
    closePurchaseModal();
  }
}); 