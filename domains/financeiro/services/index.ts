import type { AccountsPayable, AccountsReceivable, FinancialTransaction, FinanceSummary } from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'
import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse, normalizeCurrencyValue } from '../../shared/service-utils'
import { financialTransactionSchema, payableSchema, receivableSchema } from '../validation'

type FinancialTransactionRow = Tables<'financial_transactions'>
type AccountsPayableRow = Tables<'accounts_payable'>
type AccountsReceivableRow = Tables<'accounts_receivable'>

function mapTransaction(row: FinancialTransactionRow): FinancialTransaction {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    transaction_type: row.transaction_type,
    description: row.description,
    amount: normalizeCurrencyValue(row.amount),
    occurred_at: row.occurred_at,
    category: row.category,
    cash_account_id: row.cash_account_id,
    order_id: row.order_id,
  }
}

function mapPayable(row: AccountsPayableRow): AccountsPayable {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    supplier_id: row.supplier_id,
    description: row.description,
    amount: normalizeCurrencyValue(row.amount),
    status: row.status,
    due_date: row.due_date,
    paid_at: row.paid_at,
    notes: row.notes,
  }
}

function mapReceivable(row: AccountsReceivableRow): AccountsReceivable {
  return {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    customer_id: row.customer_id,
    order_id: row.order_id,
    description: row.description,
    amount: normalizeCurrencyValue(row.amount),
    status: row.status,
    due_date: row.due_date,
    received_at: row.received_at,
    notes: row.notes,
  }
}

export function useFinanceService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const listTransactions = async (params: PaginationParams = {}): Promise<PaginatedResponse<FinancialTransaction>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 10
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await client
      .from('financial_transactions')
      .select('*', { count: 'exact' })
      .order(params.order_by ?? 'occurred_at', { ascending: params.order_direction === 'asc' })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar as transações financeiras')
    return buildPaginatedResponse((data ?? []).map(mapTransaction), count ?? 0, params)
  }

  const registerTransaction = async (input: Omit<FinancialTransaction, keyof Tables<'financial_transactions'> | 'id' | 'created_at' | 'updated_at'> & {
    transaction_type: FinancialTransaction['transaction_type']
    description: string
    amount: number
    occurred_at?: string
    category?: string | null
    cash_account_id?: string | null
    order_id?: string | null
  }) => {
    const payload = financialTransactionSchema.parse(input)

    const { data, error } = await client
      .from('financial_transactions')
      .insert({
        transaction_type: payload.transaction_type,
        description: payload.description,
        amount: payload.amount,
        occurred_at: payload.occurred_at ?? new Date().toISOString(),
        category: payload.category ?? null,
        cash_account_id: payload.cash_account_id ?? null,
        order_id: payload.order_id ?? null,
        created_by: user.value?.id ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível registrar a transação financeira')
    return mapTransaction(data)
  }

  const registerPayable = async (input: {
    supplier_id?: string
    description: string
    amount: number
    due_date: string
    notes?: string
  }) => {
    const payload = payableSchema.parse(input)

    const { data, error } = await client
      .from('accounts_payable')
      .insert({
        supplier_id: payload.supplier_id ?? null,
        description: payload.description,
        amount: payload.amount,
        due_date: payload.due_date,
        notes: payload.notes ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível registrar a conta a pagar')
    return mapPayable(data)
  }

  const registerReceivable = async (input: {
    customer_id?: string
    order_id?: string
    description: string
    amount: number
    due_date: string
    notes?: string
  }) => {
    const payload = receivableSchema.parse(input)

    const { data, error } = await client
      .from('accounts_receivable')
      .insert({
        customer_id: payload.customer_id ?? null,
        order_id: payload.order_id ?? null,
        description: payload.description,
        amount: payload.amount,
        due_date: payload.due_date,
        notes: payload.notes ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível registrar a conta a receber')
    return mapReceivable(data)
  }

  const listReceivables = async (params: PaginationParams = {}): Promise<PaginatedResponse<AccountsReceivable>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await client
      .from('accounts_receivable')
      .select('*', { count: 'exact' })
      .order('due_date', { ascending: true })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar contas a receber')
    return buildPaginatedResponse((data ?? []).map(mapReceivable), count ?? 0, params)
  }

  const listPayables = async (params: PaginationParams = {}): Promise<PaginatedResponse<AccountsPayable>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await client
      .from('accounts_payable')
      .select('*', { count: 'exact' })
      .order('due_date', { ascending: true })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar contas a pagar')
    return buildPaginatedResponse((data ?? []).map(mapPayable), count ?? 0, params)
  }

  const listCashAccounts = async () => {
    const { data, error } = await client
      .from('cash_accounts')
      .select('*')
      .eq('active', true)
      .order('name')

    assertSupabaseResult(error, 'Não foi possível carregar as contas de caixa')
    return data ?? []
  }

  const getSummary = async (): Promise<FinanceSummary> => {
    const [{ data: transactions, error: transactionsError }, { data: receivables, error: receivablesError }, { data: payables, error: payablesError }] = await Promise.all([
      client.from('financial_transactions').select('transaction_type, amount, occurred_at'),
      client.from('accounts_receivable').select('amount, status'),
      client.from('accounts_payable').select('amount, status'),
    ])

    assertSupabaseResult(transactionsError, 'Não foi possível carregar o resumo financeiro')
    assertSupabaseResult(receivablesError, 'Não foi possível carregar as contas a receber')
    assertSupabaseResult(payablesError, 'Não foi possível carregar as contas a pagar')

    const monthlyTransactions = (transactions ?? []).filter((transaction) => {
      const occurredAt = new Date(transaction.occurred_at)
      const now = new Date()
      return occurredAt.getMonth() === now.getMonth() && occurredAt.getFullYear() === now.getFullYear()
    })

    const income = monthlyTransactions
      .filter(transaction => transaction.transaction_type === 'income')
      .reduce((sum, transaction) => sum + normalizeCurrencyValue(transaction.amount), 0)

    const expense = monthlyTransactions
      .filter(transaction => transaction.transaction_type === 'expense')
      .reduce((sum, transaction) => sum + normalizeCurrencyValue(transaction.amount), 0)

    const receivablesTotal = (receivables ?? [])
      .filter(row => row.status === 'pending' || row.status === 'partial')
      .reduce((sum, row) => sum + normalizeCurrencyValue(row.amount), 0)

    const payablesTotal = (payables ?? [])
      .filter(row => row.status === 'pending' || row.status === 'partial')
      .reduce((sum, row) => sum + normalizeCurrencyValue(row.amount), 0)

    return {
      balance: income - expense,
      receivables: receivablesTotal,
      payables: payablesTotal,
      monthlyProfit: income - expense,
    }
  }

  return {
    listTransactions,
    listReceivables,
    listPayables,
    listCashAccounts,
    registerTransaction,
    registerPayable,
    registerReceivable,
    getSummary,
  }
}
