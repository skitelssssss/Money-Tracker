import crypto from 'node:crypto';

/**
 * Validates Telegram Mini App initData signature.
 * @param {string} initData - raw query string (tgWebAppData)
 * @param {string} botToken - Telegram bot token
 * @returns {{ valid: boolean, user: object|null }}
 */
export function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);

  const hash = params.get('hash');
  if (!hash) {
    return { valid: false, user: null };
  }

  params.delete('hash');

  // Sort keys alphabetically, build data check string
  const checkString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  // Secret key = HMAC_SHA256("WebAppData", bot_token)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  // Computed hash = HMAC_SHA256(secret_key, data_check_string)
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  if (computedHash !== hash) {
    return { valid: false, user: null };
  }

  // Auth date check — optional, expires after 24h
  const authDate = parseInt(params.get('auth_date'), 10);
  if (!authDate || Date.now() / 1000 - authDate > 86400) {
    return { valid: false, user: null };
  }

  // Parse user from the `user` param (JSON-encoded)
  const userRaw = params.get('user');
  if (!userRaw) {
    return { valid: false, user: null };
  }

  try {
    const user = JSON.parse(userRaw);
    return {
      valid: true,
      user: {
        telegramId: String(user.id),
        username: user.username ?? null,
        firstName: user.first_name ?? null,
        lastName: user.last_name ?? null,
      },
    };
  } catch {
    return { valid: false, user: null };
  }
}
