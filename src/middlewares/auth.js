import { validateInitData } from '../utils/initData.js';
import * as userRepo from '../models/userRepository.js';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';

export async function authMiddleware(req, _res, next) {
  const initData = req.headers['x-telegram-initdata'];
  const userIdHeader = req.headers['x-user-id'];

  // Dev mode: X-User-Id header — auto-create user if missing
  if (!initData && userIdHeader) {
    const telegramId = String(userIdHeader);
    let dbUser = await userRepo.findUserByTelegramId(telegramId);

    if (!dbUser) {
      dbUser = await userRepo.createUser(telegramId, `dev_${telegramId}`);
    }

    req.user = { id: dbUser.id, telegramId: dbUser.telegramId, username: dbUser.username };
    return next();
  }

  // Telegram Mini App mode: validate initData signature
  if (!initData) {
    throw new AppError('X-Telegram-InitData или X-User-Id header обязателен', 401);
  }

  const { valid, user } = validateInitData(initData, config.botToken);

  if (!valid || !user) {
    throw new AppError('Невалидная подпись Telegram initData', 401);
  }

  let dbUser = await userRepo.findUserByTelegramId(user.telegramId);
  if (!dbUser) {
    dbUser = await userRepo.createUser(user.telegramId, user.username);
  }

  req.user = {
    id: dbUser.id,
    telegramId: dbUser.telegramId,
    username: dbUser.username,
  };

  next();
}
