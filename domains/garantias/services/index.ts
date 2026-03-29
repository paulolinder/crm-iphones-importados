import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse } from '../../shared/service-utils'
import type { PaginatedResponse, PaginationParams } from '~/types'

type WarrantyRow = Tables<'warranties'>

export function useWarrantiesService() {
  const { client } = useSupabase()

  const list = async (params: PaginationParams = {}): Promise<PaginatedResponse<WarrantyRow & { customer_name?: string | null }>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await client
      .from('warranties')
      .select(`
        *,
        customers ( name )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar garantias')

    const rows = (data ?? []).map((raw) => {
      const row = raw as WarrantyRow & { customers?: { name?: string } | null }
      const { customers: _c, ...rest } = row as WarrantyRow & { customers?: unknown }
      return {
        ...rest,
        customer_name: row.customers?.name ?? null,
      }
    })

    return buildPaginatedResponse(rows, count ?? 0, params)
  }

  const getById = async (id: string) => {
    const { data, error } = await client
      .from('warranties')
      .select(`
        *,
        customers ( id, name, email, phone )
      `)
      .eq('id', id)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível carregar a garantia')
    return data
  }

  const create = async (input: {
    customer_id?: string | null
    order_item_id?: string | null
    device_unit_id?: string | null
    warranty_start?: string | null
    warranty_end?: string | null
    status?: Tables<'warranties'>['status']
    notes?: string | null
    terms?: string | null
  }) => {
    const { data, error } = await client
      .from('warranties')
      .insert({
        customer_id: input.customer_id ?? null,
        order_item_id: input.order_item_id ?? null,
        device_unit_id: input.device_unit_id ?? null,
        warranty_start: input.warranty_start ?? null,
        warranty_end: input.warranty_end ?? null,
        status: input.status ?? 'valid',
        notes: input.notes ?? null,
        terms: input.terms ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível registrar a garantia')
    return data
  }

  const update = async (id: string, input: Partial<{
    status: Tables<'warranties'>['status']
    warranty_start: string | null
    warranty_end: string | null
    notes: string | null
    terms: string | null
    claim_reason: string | null
    claimed_at: string | null
  }>) => {
    const { data, error } = await client
      .from('warranties')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível atualizar a garantia')
    return data
  }

  return { list, getById, create, update }
}
