import { z } from 'zod'

export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  imei: z.string().trim().optional(),
})

export const orderFormSchema = z.object({
  customer_id: z.string().uuid(),
  seller_id: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1, 'Adicione ao menos um item'),
  discount: z.number().nonnegative().optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  shipping: z.number().nonnegative().optional(),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'transfer', 'installment', 'check', 'other']).optional(),
  notes: z.string().trim().optional(),
})

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['draft', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  notes: z.string().trim().optional(),
})

export type OrderFormSchema = z.infer<typeof orderFormSchema>
