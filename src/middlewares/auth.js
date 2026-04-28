import { validateInitData } from '../utils/initData.js';
import * as userRepo from '../models/userRepository.js';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';

export async function authMiddleware(req, _res, next) {
  const initData = req.headers['x-telegram-initdata'];
  const userIdHeader = req.headers['x-user-id'];

  // Dev mode: explicit X-User-Id header (bypasses Telegram auth)
  if (!initData && userIdHeader) {
    const id = parseInt(userIdHeader, 10);
    if (!id) {
      throw new AppError('X-User-Id должен быть числом', 400);
    }
    const dbUser = await userRepo.findUserById(id);
    if (!dbUser) {
      throw new AppError('Пользователь не найден', 404);
    }
    req.user = { id: dbUser.id, telegramId: dbUser.telegramId, username: dbUser.username };
    return next();
  }

  // Telegram Mini App mode: validate initData
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
