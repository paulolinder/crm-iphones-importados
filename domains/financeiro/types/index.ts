import type { BaseEntity } from '~/types'

export interface FinancialTransaction extends BaseEntity {
  transaction_type: 'income' | 'expense' | 'transfer' | 'adjustment'
  description: string
  amount: number
  occurred_at: string
  category: string | null
  cash_account_id: string | null
  order_id: string | null
}

export interface AccountsPayable extends BaseEntity {
  supplier_id: string | null
  description: string
  amount: number
  status: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed' | 'cancelled'
  due_date: string
  paid_at: string | null
  notes: string | null
}

export interface AccountsReceivable extends BaseEntity {
  customer_id: string | null
  order_id: string | null
  description: string
  amount: number
  status: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed' | 'cancelled'
  due_date: string
  received_at: string | null
  notes: string | null
}

export interface FinanceSummary {
  balance: number
  receivables: number
  payables: number
  monthlyProfit: number
}
