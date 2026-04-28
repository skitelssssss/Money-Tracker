import prisma from '../config/db.js';

export function createUser(telegramId, username) {
  return prisma.user.create({
    data: { telegramId, username },
  });
}

export function findUserByTelegramId(telegramId) {
  return prisma.user.findUnique({
    where: { telegramId },
  });
}

export function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function getAllUsers() {
  return prisma.user.findMany();
}
