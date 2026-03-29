/**
 * Produtos Module Types
 *
 * Tipos específicos do módulo de produtos
 */

import type { BaseEntity } from '~/types'
import type { ProductCostBreakdownInput } from '../cost-breakdown'

export interface Product extends BaseEntity {
  name: string
  sku: string | null
  barcode: string | null
  description: string | null
  category_id: string | null
  brand_id: string | null
  price: number
  cost: number | null
  promotional_price: number | null
  stock_quantity: number
  min_stock: number
  max_stock: number | null
  weight: number | null
  dimensions: ProductDimensions | null
  images: string[]
  specifications: Record<string, string | number | boolean | object | null>
  /** Derivado de specifications.cost_breakdown quando existir */
  cost_breakdown?: ProductCostBreakdownInput | null
  warranty_months: number | null
  active: boolean
  featured: boolean
  status: 'draft' | 'active' | 'inactive' | 'archived'
  is_trackable?: boolean
  
  // Relations (populated)
  category?: ProductCategory
  brand?: ProductBrand
}

export interface ProductCategory extends BaseEntity {
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image: string | null
  active: boolean
  sort_order: number
}

export interface ProductBrand extends BaseEntity {
  name: string
  slug: string
  description: string | null
  logo: string | null
  active: boolean
}

export interface ProductDimensions {
  width: number
  height: number
  depth: number
  unit: 'cm' | 'mm'
}

export interface ProductFormData {
  name: string
  sku?: string
  barcode?: string
  description?: string
  category_id?: string
  brand_id?: string
  price: number
  /** Custo total; se cost_breakdown existir, o serviço recalcula a partir dele */
  cost?: number
  /** Opcional: frete, freteiro, NF-e, USD × cotação, custo base R$ */
  cost_breakdown?: ProductCostBreakdownInput
  promotional_price?: number
  min_stock?: number
  max_stock?: number
  /** Quantidade em estoque (criação: inicial; edição: sincroniza inventory_items) */
  stock_quantity?: number
  weight?: number
  dimensions?: ProductDimensions
  images?: string[]
  specifications?: Record<string, unknown>
  warranty_months?: number
  active?: boolean
  featured?: boolean
  status?: 'draft' | 'active' | 'inactive' | 'archived'
  is_trackable?: boolean
}

export interface ProductFilters {
  search?: string
  category_id?: string
  brand_id?: string
  status?: 'active' | 'inactive'
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
  price_min?: number
  price_max?: number
}

export interface ProductStats {
  total: number
  active: number
  in_stock: number
  low_stock: number
  out_of_stock: number
  total_value: number
}
