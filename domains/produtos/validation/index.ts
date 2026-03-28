import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().trim().min(3, 'Nome é obrigatório'),
  sku: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  description: z.string().trim().optional(),
  category_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
  price: z.number().nonnegative('Preço de venda deve ser positivo'),
  cost: z.number().nonnegative('Custo deve ser positivo').optional(),
  promotional_price: z.number().nonnegative().optional(),
  min_stock: z.number().int().nonnegative().optional(),
  max_stock: z.number().int().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.object({
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
    depth: z.number().nonnegative(),
    unit: z.enum(['cm', 'mm']),
  }).optional(),
  images: z.array(z.string().url()).optional(),
  specifications: z.record(z.string()).optional(),
  warranty_months: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
  is_trackable: z.boolean().optional(),
})

export const productUpdateSchema = productFormSchema.partial()

export type ProductFormSchema = z.infer<typeof productFormSchema>
