// wallet.js - manages wallet data and updates wallet page

const DEFAULT_WALLET = {
  UAH: 50000.00,
  USDT: 0.00,
  BTC: 0.00000000,
  ETH: 0.00000000
};

function getWallet() {
  const stored = localStorage.getItem('wallet');
  if (stored) return JSON.parse(stored);
  return { ...DEFAULT_WALLET };
}

function setWallet(wallet) {
  localStorage.setItem('wallet', JSON.stringify(wallet));
}

function updateWalletUI() {
  const wallet = getWallet();
  if (document.getElementById('wallet-uah'))
    document.getElementById('wallet-uah').textContent = wallet.UAH.toFixed(2) + ' UAH';
  if (document.getElementById('wallet-usdt'))
    document.getElementById('wallet-usdt').textContent = wallet.USDT.toFixed(2) + ' USDT';
  if (document.getElementById('wallet-btc'))
    document.getElementById('wallet-btc').textContent = wallet.BTC.toFixed(8) + ' BTC';
  if (document.getElementById('wallet-eth'))
    document.getElementById('wallet-eth').textContent = wallet.ETH.toFixed(8) + ' ETH';
}

// Expose for index.html
window.getWallet = getWallet;
window.setWallet = setWallet;
window.updateWalletUI = updateWalletUI;

// On wallet.html, update UI on load
if (typeof updateWalletUI === 'function') {
  document.addEventListener('DOMContentLoaded', updateWalletUI);
} 