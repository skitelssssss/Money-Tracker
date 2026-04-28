import prisma from '../config/db.js';

export function createTransaction(userId, data) {
  return prisma.transaction.create({
    data: {
      userId,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description ?? null,
      date: data.date ? new Date(data.date) : new Date(),
    },
  });
}

export function getTransactionsByUserId(userId, opts = {}) {
  const where = { userId };

  if (opts.type) {
    where.type = opts.type;
  }
  if (opts.dateFrom || opts.dateTo) {
    where.date = {};
    if (opts.dateFrom) where.date.gte = new Date(opts.dateFrom);
    if (opts.dateTo) where.date.lte = new Date(opts.dateTo);
  }

  return prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    skip: opts.skip ?? 0,
    take: opts.take ?? 20,
  });
}

export function getTransactionById(id) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

export function updateTransaction(id, data) {
  return prisma.transaction.update({
    where: { id },
    data: {
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
    },
  });
}

export function deleteTransaction(id) {
  return prisma.transaction.delete({
    where: { id },
  });
}

export function countTransactions(userId, opts = {}) {
  const where = { userId };

  if (opts.type) {
    where.type = opts.type;
  }
  if (opts.dateFrom || opts.dateTo) {
    where.date = {};
    if (opts.dateFrom) where.date.gte = new Date(opts.dateFrom);
    if (opts.dateTo) where.date.lte = new Date(opts.dateTo);
  }

  return prisma.transaction.count({ where });
}

export function getTransactionsSummary(userId, type) {
  return prisma.transaction.aggregate({
    where: { userId, type },
    _sum: { amount: true },
    _count: true,
  });
}
