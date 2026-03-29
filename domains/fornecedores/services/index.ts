import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse } from '../../shared/service-utils'
import type { PaginatedResponse, PaginationParams } from '~/types'

export interface Supplier {
  id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  document: string | null
  notes: string | null
  active: boolean
  created_at: string
}

type SupplierRow = Tables<'suppliers'>

function mapRow(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    contact_name: row.contact_name,
    email: row.email,
    phone: row.phone,
    document: row.document,
    notes: row.notes,
    active: row.active,
    created_at: row.created_at,
  }
}

export function useSuppliersService() {
  const { client } = useSupabase()

  const list = async (params: PaginationParams & { search?: string } = {}): Promise<PaginatedResponse<Supplier>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = client.from('suppliers').select('*', { count: 'exact' }).order('name')

    if (params.search) {
      query = query.ilike('name', `%${params.search}%`)
    }

    const { data, error, count } = await query.range(from, to)
    assertSupabaseResult(error, 'Não foi possível carregar fornecedores')
    return buildPaginatedResponse((data ?? []).map(mapRow), count ?? 0, params)
  }

  const getById = async (id: string) => {
    const { data, error } = await client.from('suppliers').select('*').eq('id', id).maybeSingle()
    assertSupabaseResult(error, 'Não foi possível carregar o fornecedor')
    return data ? mapRow(data) : null
  }

  const create = async (input: {
    name: string
    contact_name?: string | null
    email?: string | null
    phone?: string | null
    document?: string | null
    notes?: string | null
    active?: boolean
  }) => {
    const { data, error } = await client
      .from('suppliers')
      .insert({
        name: input.name.trim(),
        contact_name: input.contact_name?.trim() || null,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        document: input.document?.trim() || null,
        notes: input.notes?.trim() || null,
        active: input.active ?? true,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível criar o fornecedor')
    return mapRow(data)
  }

  const update = async (id: string, input: Partial<{
    name: string
    contact_name: string | null
    email: string | null
    phone: string | null
    document: string | null
    notes: string | null
    active: boolean
  }>) => {
    const { data, error } = await client
      .from('suppliers')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível atualizar o fornecedor')
    return mapRow(data)
  }

  return { list, getById, create, update }
}
