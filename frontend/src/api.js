const BASE = window.location.origin;

// Dev mode: use this userId when testing outside Telegram
const DEV_USER_ID = 1;

function getInitData() {
  return window.Telegram?.WebApp?.initData || '';
}

function isInTelegram() {
  return !!window.Telegram?.WebApp?.initData;
}

async function request(path, options = {}) {
  const initData = getInitData();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // In Telegram → send initData for validation
  // In browser → send X-User-Id for dev mode
  if (isInTelegram() && initData) {
    headers['X-Telegram-InitData'] = initData;
  } else {
    headers['X-User-Id'] = String(DEV_USER_ID);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
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
