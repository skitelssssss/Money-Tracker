const BASE = window.location.origin;

function getInitData() {
  return window.Telegram?.WebApp?.initData || '';
}

async function request(path, options = {}) {
  const initData = getInitData();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(initData ? { 'X-Telegram-InitData': initData } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const message = json.details
      ? json.details.map((d) => d.message).join('; ')
      : json.message || 'Ошибка сервера';
    throw new Error(message);
  }

  return json;
}

export function fetchTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.page) params.set('page', filters.page);
  if (filters.limit) params.set('limit', filters.limit);

  const qs = params.toString();
  return request(`/api/transactions${qs ? `?${qs}` : ''}`);
}

export function createTransaction(data) {
  return request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id) {
  return request(`/api/transactions/${id}`, {
    method: 'DELETE',
  });
}
