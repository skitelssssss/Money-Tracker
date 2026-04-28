import { TransactionForm } from './components/TransactionForm.js';
import { TransactionList } from './components/TransactionList.js';

const tg = window.Telegram?.WebApp;

// Init Telegram SDK
if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();

  // Apply theme colors as CSS variables
  document.documentElement.style.setProperty('--tg-bg', tg.backgroundColor || '#ffffff');
  document.documentElement.style.setProperty('--tg-text', tg.textColor || '#000000');
  document.documentElement.style.setProperty('--tg-hint', tg.hintColor || '#999999');
  document.documentElement.style.setProperty('--tg-link', tg.linkColor || '#2481cc');
  document.documentElement.style.setProperty('--tg-button', tg.buttonColor || '#2481cc');
  document.documentElement.style.setProperty('--tg-button-text', tg.buttonTextColor || '#ffffff');
  document.documentElement.style.setProperty('--tg-secondary-bg', tg.secondaryBackgroundColor || '#f0f0f0');
  document.documentElement.style.setProperty('--tg-destructive', tg.destructiveTextColor || '#ff3b30');

  // User greeting
  const user = tg.initDataUnsafe?.user;
  if (user) {
    const el = document.getElementById('user-greeting');
    el.textContent = user.first_name || user.username || '';
  }
}

// Tab switching
const tabContent = document.getElementById('tab-content');
let currentTab = 'list';
const componentCache = {};

function renderTab(tab) {
  currentTab = tab;
  tabContent.innerHTML = '';

  if (!componentCache[tab]) {
    componentCache[tab] = tab === 'list' ? TransactionList() : TransactionForm();
  }

  tabContent.appendChild(componentCache[tab]);

  // Refresh list when switching to it
  if (tab === 'list') {
    window.dispatchEvent(new Event('tx-added'));
  }
}

document.querySelectorAll('.tab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    tabBtn.classList.add('active');
    renderTab(tabBtn.dataset.tab);
  });
});

// Load initial tab
renderTab('list');
