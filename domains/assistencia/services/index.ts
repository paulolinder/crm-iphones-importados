import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse } from '../../shared/service-utils'
import type { PaginatedResponse, PaginationParams } from '~/types'

type AssistanceRow = Tables<'technical_assistance_orders'>

export function useTechnicalAssistanceService() {
  const { client } = useSupabase()

  const list = async (params: PaginationParams = {}): Promise<PaginatedResponse<AssistanceRow & { customer_name?: string | null }>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await client
      .from('technical_assistance_orders')
      .select(`
        *,
        customers ( name )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar ordens de serviço')

    const rows = (data ?? []).map((raw) => {
      const row = raw as AssistanceRow & { customers?: { name?: string } | null }
      const { customers: _c, ...rest } = row as AssistanceRow & { customers?: unknown }
      return {
        ...rest,
        customer_name: row.customers?.name ?? null,
      }
    })

    return buildPaginatedResponse(rows, count ?? 0, params)
  }

  const getById = async (id: string) => {
    const { data, error } = await client
      .from('technical_assistance_orders')
      .select(`
        *,
        customers ( id, name, email, phone )
      `)
      .eq('id', id)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível carregar a OS')
    return data
  }

  const create = async (input: {
    customer_id: string
    issue_description: string
    device_unit_id?: string | null
    diagnosis?: string | null
    estimated_cost?: number | null
  }) => {
    const order_number = `OS-${Date.now()}`
    const { data, error } = await client
      .from('technical_assistance_orders')
      .insert({
        customer_id: input.customer_id,
        issue_description: input.issue_description.trim(),
        order_number,
        device_unit_id: input.device_unit_id ?? null,
        diagnosis: input.diagnosis?.trim() ?? null,
        estimated_cost: input.estimated_cost ?? null,
        status: 'pending',
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível abrir a OS')
    return data
  }

  const update = async (id: string, input: Partial<{
    status: AssistanceRow['status']
    diagnosis: string | null
    solution: string | null
    estimated_cost: number | null
    final_cost: number | null
    assigned_to: string | null
    started_at: string | null
    finished_at: string | null
    delivered_at: string | null
  }>) => {
    const { data, error } = await client
      .from('technical_assistance_orders')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível atualizar a OS')
    return data
  }

  return { list, getById, create, update }
}
