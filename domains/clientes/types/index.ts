/**
 * Clientes Module Types
 *
 * Tipos específicos do módulo de clientes
 */

import type { BaseEntity, Address, ContactInfo } from '~/types'

export interface Customer extends BaseEntity {
  name: string
  email: string | null
  phone: string | null
  mobile: string | null
  whatsapp: string | null
  document: string | null
  document_type: 'cpf' | 'cnpj' | null
  birth_date: string | null
  gender: 'M' | 'F' | null
  address: Address | null
  notes: string | null
  tags: string[]
  total_orders: number
  total_spent: number
  last_purchase_at: string | null
  active: boolean
}

export interface CustomerFormData {
  name: string
  email?: string
  phone?: string
  mobile?: string
  whatsapp?: string
  document?: string
  document_type?: 'cpf' | 'cnpj'
  birth_date?: string
  gender?: 'M' | 'F'
  address?: Partial<Address>
  notes?: string
  tags?: string[]
}

export interface CustomerFilters {
  search?: string
  status?: 'active' | 'inactive'
  has_orders?: boolean
  tags?: string[]
  created_from?: string
  created_to?: string
}

export interface CustomerStats {
  total: number
  active: number
  inactive: number
  new_this_month: number
  with_orders: number
}
