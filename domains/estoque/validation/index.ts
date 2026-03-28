import { z } from 'zod'

export const stockEntrySchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  unit_cost: z.number().nonnegative().optional(),
  supplier_id: z.string().uuid().optional(),
  invoice_number: z.string().trim().optional(),
  imeis: z.array(z.string().trim().min(8)).optional(),
  notes: z.string().trim().optional(),
})

export const stockExitSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.enum(['sale', 'return', 'damaged', 'lost', 'other']),
  reference_id: z.string().uuid().optional(),
  imeis: z.array(z.string().trim().min(8)).optional(),
  notes: z.string().trim().optional(),
})

export type StockEntrySchema = z.infer<typeof stockEntrySchema>
export type StockExitSchema = z.infer<typeof stockExitSchema>
