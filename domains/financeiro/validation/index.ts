import { z } from 'zod'

export const financialTransactionSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  description: z.string().trim().min(3),
  amount: z.number().positive(),
  occurred_at: z.string().datetime().optional(),
  category: z.string().trim().optional(),
  cash_account_id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
})

export const payableSchema = z.object({
  supplier_id: z.string().uuid().optional(),
  description: z.string().trim().min(3),
  amount: z.number().positive(),
  due_date: z.string().min(10),
  notes: z.string().trim().optional(),
})

export const receivableSchema = z.object({
  customer_id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  description: z.string().trim().min(3),
  amount: z.number().positive(),
  due_date: z.string().min(10),
  notes: z.string().trim().optional(),
})
