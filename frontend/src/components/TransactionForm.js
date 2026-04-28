import { createTransaction } from '../api.js';

const CATEGORIES = ['Продукты', 'Транспорт', 'Кафе', 'Зарплата', 'Жилье', 'Здоровье', 'Развлечения', 'Одежда', 'Связь', 'Другое'];

export function TransactionForm() {
  const container = document.createElement('div');

  container.innerHTML = `
    <form id="tx-form" class="form-card">
      <div class="type-toggle">
        <button type="button" class="type-btn active-expense" data-type="EXPENSE">Расход</button>
        <button type="button" class="type-btn" data-type="INCOME">Доход</button>
      </div>

      <div class="form-group">
        <label>Сумма</label>
        <input type="number" name="amount" placeholder="0.00" step="0.01" min="0.01" required>
      </div>

      <div class="form-group">
        <label>Категория</label>
        <select name="category" required>
          <option value="">Выберите...</option>
          ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Описание (необязательно)</label>
        <textarea name="description" placeholder="Заметка..."></textarea>
      </div>

      <div class="form-group">
        <label>Дата (необязательно)</label>
        <input type="date" name="date">
      </div>

      <button type="submit" class="submit-btn">Сохранить</button>
    </form>
  `;

  // Type toggle logic
  let selectedType = 'EXPENSE';
  container.querySelectorAll('.type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      container.querySelectorAll('.type-btn').forEach((b) => {
        b.classList.remove('active-expense', 'active-income');
      });
      btn.classList.add(selectedType === 'EXPENSE' ? 'active-expense' : 'active-income');
    });
  });

  // Form submit
  const form = container.querySelector('#tx-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    try {
      const data = {
        type: selectedType,
        amount: parseFloat(form.amount.value),
        category: form.category.value,
        description: form.description.value || undefined,
        date: form.date.value ? new Date(form.date.value).toISOString() : undefined,
      };

      await createTransaction(data);
      form.reset();
      container.querySelector('.type-btn[data-type="EXPENSE"]').click();
      window.dispatchEvent(new Event('tx-added'));
      showToast('Сохранено');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Сохранить';
    }
  });

  return container;
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${isError ? 'error' : ''}`;
  setTimeout(() => (toast.className = 'toast hidden'), 2500);
}
