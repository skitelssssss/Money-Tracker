import { fetchTransactions, deleteTransaction } from '../api.js';

export function TransactionList() {
  const container = document.createElement('div');

  container.innerHTML = `
    <div class="filters">
      <button class="filter-btn active" data-type="">Все</button>
      <button class="filter-btn" data-type="EXPENSE">Расходы</button>
      <button class="filter-btn" data-type="INCOME">Доходы</button>
    </div>
    <div id="tx-list-content" class="tx-list">
      <div class="loader">Загрузка...</div>
    </div>
  `;

  let currentFilter = '';

  // Filter buttons
  container.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.type;
      loadTransactions();
    });
  });

  // Reload on new tx added
  function onTxAdded() {
    loadTransactions();
  }

  window.addEventListener('tx-added', onTxAdded);

  async function loadTransactions() {
    const list = container.querySelector('#tx-list-content');
    list.innerHTML = '<div class="loader">Загрузка...</div>';

    try {
      const filters = {};
      if (currentFilter) filters.type = currentFilter;

      const { data } = await fetchTransactions(filters);

      if (data.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon">📋</span>
            <p>Нет операций</p>
          </div>`;
        return;
      }

      list.innerHTML = '';
      data.forEach((tx) => {
        const sign = tx.type === 'INCOME' ? '+' : '-';
        const cssClass = tx.type === 'INCOME' ? 'income' : 'expense';
        const dateStr = new Date(tx.date).toLocaleDateString('ru-RU');

        const item = document.createElement('div');
        item.className = 'tx-item';
        item.innerHTML = `
          <div class="tx-left">
            <span class="tx-category">${escapeHtml(tx.category)}</span>
            <span class="tx-meta">${dateStr}${tx.description ? ` · ${escapeHtml(tx.description)}` : ''}</span>
          </div>
          <div class="tx-right">
            <div class="tx-amount ${cssClass}">${sign}${formatAmount(tx.amount)} ₽</div>
            <button class="tx-delete" data-id="${tx.id}" title="Удалить">✕</button>
          </div>
        `;

        item.querySelector('.tx-delete').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm('Удалить эту операцию?')) return;

          try {
            await deleteTransaction(tx.id);
            loadTransactions();
          } catch (err) {
            const toast = document.getElementById('toast');
            if (toast) {
              toast.textContent = err.message;
              toast.className = 'toast error';
              setTimeout(() => (toast.className = 'toast hidden'), 2500);
            }
          }
        });

        list.appendChild(item);
      });
    } catch (err) {
      list.innerHTML = `<div class="empty-state"><p>Ошибка загрузки: ${escapeHtml(err.message)}</p></div>`;
    }
  }

  loadTransactions();
  return container;
}

function formatAmount(n) {
  return Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
