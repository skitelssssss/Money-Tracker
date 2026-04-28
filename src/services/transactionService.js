import * as transactionRepo from '../models/transactionRepository.js';

export async function createTransaction(userId, data) {
  return transactionRepo.createTransaction(userId, data);
}

export async function getTransactions(userId, filters) {
  const { page, limit, type, dateFrom, dateTo } = filters;
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    transactionRepo.getTransactionsByUserId(userId, { skip, take: limit, type, dateFrom, dateTo }),
    transactionRepo.countTransactions(userId, { type, dateFrom, dateTo }),
  ]);

  return {
    data: transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function deleteTransaction(userId, id) {
  const tx = await transactionRepo.getTransactionById(id);
  if (!tx) {
    return null;
  }
  if (tx.userId !== userId) {
    return 'forbidden';
  }
  return transactionRepo.deleteTransaction(id);
}
