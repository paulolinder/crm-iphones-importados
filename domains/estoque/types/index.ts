/**
 * Estoque Module Types
 *
 * Tipos específicos do módulo de estoque
 */

import type { BaseEntity, StockStatus } from '~/types'

export interface StockMovement extends BaseEntity {
  product_id: string
  type: 'entry' | 'exit' | 'adjustment' | 'transfer' | 'reservation' | 'release'
  quantity: number
  previous_quantity: number
  new_quantity: number
  unit_cost: number | null
  total_cost: number | null
  reference_type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'transfer' | null
  reference_id: string | null
  imei: string | null
  serial_number: string | null
  notes: string | null
  user_id: string
  
  // Relations
  product?: {
    id: string
    name: string
    sku: string | null
  }
  user?: {
    id: string
    name: string
  }
}

export interface ProductStock {
  id: string
  product_id: string
  product_name: string
  sku: string | null
  quantity: number
  reserved: number
  available: number
  min_stock: number
  max_stock: number | null
  status: StockStatus
  last_movement_at: string | null
  average_cost: number | null
  total_value: number | null
}

export interface IMEI extends BaseEntity {
  product_id: string
  imei: string
  serial_number: string | null
  status: 'available' | 'sold' | 'reserved' | 'returned' | 'defective'
  purchase_cost: number | null
  purchase_date: string | null
  supplier_id: string | null
  sale_id: string | null
  sold_at: string | null
  warranty_until: string | null
  notes: string | null
  
  // Relations
  product?: {
    id: string
    name: string
    sku: string | null
  }
}

export interface StockEntryFormData {
  product_id: string
  quantity: number
  unit_cost?: number
  supplier_id?: string
  invoice_number?: string
  imeis?: string[]
  notes?: string
}

export interface StockExitFormData {
  product_id: string
  quantity: number
  reason: 'sale' | 'return' | 'damaged' | 'lost' | 'other'
  reference_id?: string
  imeis?: string[]
  notes?: string
}

export interface StockFilters {
  search?: string
  status?: StockStatus
  category_id?: string
  brand_id?: string
  has_imei?: boolean
}

export interface StockStats {
  total_products: number
  total_items: number
  low_stock_count: number
  out_of_stock_count: number
  total_value: number
}
