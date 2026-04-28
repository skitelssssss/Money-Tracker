import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Тип должен быть INCOME или EXPENSE',
  }),
  amount: z.number().positive({ message: 'Сумма должна быть положительным числом' }),
  category: z.string().min(1, { message: 'Категория обязательна' }).max(100),
  description: z.string().max(500).optional(),
  date: z.string().datetime({ message: 'Неверный формат даты (ISO 8601)' }).optional(),
});

export const getTransactionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
