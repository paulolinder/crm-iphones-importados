/**
 * Vendas Module Types
 *
 * Tipos específicos do módulo de vendas/pedidos
 */

import type { BaseEntity, OrderStatus, PaymentStatus, PaymentMethod } from '~/types'

export interface Order extends BaseEntity {
  number: string
  customer_id: string
  seller_id: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  
  subtotal: number
  discount: number
  discount_type: 'percentage' | 'fixed' | null
  shipping: number
  total: number
  
  items: OrderItem[]
  payments: OrderPayment[]
  
  notes: string | null
  internal_notes: string | null

  /** Caminho no bucket `order_documents` quando o PDF foi salvo no pedido */
  commercial_document_path: string | null
  commercial_document_updated_at: string | null
  
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  
  // Relations
  customer?: {
    id: string
    name: string
    email: string | null
    phone: string | null
  }
  seller?: {
    id: string
    name: string
  }
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  sku: string | null
  imei: string | null
  quantity: number
  unit_price: number
  discount: number
  total: number
  warranty_until: string | null
}

export interface OrderPayment {
  id: string
  order_id: string
  method: PaymentMethod
  amount: number
  paid_at: string | null
  installments: number
  notes: string | null
}

export interface OrderFormData {
  customer_id: string
  seller_id?: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
    discount?: number
    imei?: string
  }[]
  discount?: number
  discount_type?: 'percentage' | 'fixed'
  shipping?: number
  payment_method?: PaymentMethod
  notes?: string
}

export interface OrderFilters {
  search?: string
  status?: OrderStatus
  payment_status?: PaymentStatus
  customer_id?: string
  seller_id?: string
  date_from?: string
  date_to?: string
}

export interface OrderStats {
  total_orders: number
  total_revenue: number
  average_ticket: number
  pending_orders: number
  pending_payment: number
}
