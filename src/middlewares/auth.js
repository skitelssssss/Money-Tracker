import { validateInitData } from '../utils/initData.js';
import * as userRepo from '../models/userRepository.js';
import config from '../config/index.js';
import { AppError } from '../utils/AppError.js';

export async function authMiddleware(req, _res, next) {
  const initData = req.headers['x-telegram-initdata'];

  if (!initData) {
    throw new AppError('X-Telegram-InitData header обязателен', 401);
  }

  const { valid, user } = validateInitData(initData, config.botToken);

  if (!valid || !user) {
    throw new AppError('Невалидная подпись Telegram initData', 401);
  }

  // Auto-register: find or create user
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
