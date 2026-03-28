import type { PostgrestError } from '@supabase/supabase-js'
import type { PaginatedResponse, PaginationParams } from '~/types'

export function assertSupabaseResult(error: PostgrestError | null, fallbackMessage: string) {
  if (error) {
    throw new Error(error.message || fallbackMessage)
  }
}

export function getPaginationRange(params: PaginationParams = {}) {
  const page = Math.max(params.page ?? 1, 1)
  const perPage = Math.max(params.per_page ?? 10, 1)
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  return {
    page,
    perPage,
    from,
    to,
  }
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  params: PaginationParams = {},
): PaginatedResponse<T> {
  const { page, perPage } = getPaginationRange(params)
  const totalPages = Math.max(Math.ceil(total / perPage), 1)

  return {
    data: items,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
      has_more: page < totalPages,
    },
  }
}

export function normalizeCurrencyValue(value: number | null | undefined) {
  return Number(value ?? 0)
}
