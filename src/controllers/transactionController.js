import { createTransactionSchema, getTransactionsSchema } from '../validators/transactionValidator.js';
import * as transactionService from '../services/transactionService.js';
import { AppError } from '../utils/AppError.js';

export async function create(req, res) {
  const data = createTransactionSchema.parse(req.body);
  const transaction = await transactionService.createTransaction(req.user.id, data);
  res.status(201).json({ status: 'ok', data: transaction });
}

export async function list(req, res) {
  const filters = getTransactionsSchema.parse(req.query);
  const result = await transactionService.getTransactions(req.user.id, filters);
  res.json({ status: 'ok', ...result });
}

export async function remove(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    throw new AppError('Некорректный ID транзакции', 400);
  }

  const result = await transactionService.deleteTransaction(req.user.id, id);

  if (result === null) {
    throw new AppError('Транзакция не найдена', 404);
  }
  if (result === 'forbidden') {
    throw new AppError('Доступ запрещен', 403);
  }

  res.json({ status: 'ok', data: result });
}
