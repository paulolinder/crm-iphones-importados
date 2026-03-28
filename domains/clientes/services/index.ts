/**
 * Clientes Service
 *
 * Serviço para operações de clientes
 */

import type { Customer, CustomerFormData, CustomerFilters, CustomerStats } from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'
import { assertSupabaseResult, buildPaginatedResponse, normalizeCurrencyValue } from '../../shared/service-utils'
import { customerFormSchema, customerUpdateSchema } from '../validation'
import type { Tables } from '~/lib/supabase/types'

type CustomerRow = Tables<'customers'>
type CustomerAddressRow = Tables<'customer_addresses'>

function mapAddress(address: CustomerAddressRow | null) {
  if (!address) {
    return null
  }

  return {
    street: address.street,
    number: address.number ?? '',
    complement: address.complement ?? undefined,
    neighborhood: address.neighborhood ?? '',
    city: address.city,
    state: address.state,
    postal_code: address.postal_code ?? '',
    country: address.country,
  }
}

function mapCustomer(customer: CustomerRow, address?: CustomerAddressRow | null): Customer {
  return {
    id: customer.id,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    mobile: customer.mobile,
    whatsapp: customer.whatsapp,
    document: customer.document,
    document_type: customer.document_type,
    birth_date: customer.birth_date,
    gender: customer.gender as Customer['gender'],
    address: mapAddress(address ?? null),
    notes: customer.notes,
    tags: customer.tags,
    total_orders: customer.total_orders,
    total_spent: normalizeCurrencyValue(customer.total_spent),
    last_purchase_at: customer.last_purchase_at,
    status: customer.status,
    active: !['inactive', 'blocked'].includes(customer.status),
  }
}

export function useCustomersService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const list = async (
    params: PaginationParams & CustomerFilters = {}
  ): Promise<PaginatedResponse<Customer>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 10
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = client
      .from('customers')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.has_orders) {
      query = query.gt('total_orders', 0)
    }

    if (params.created_from) {
      query = query.gte('created_at', params.created_from)
    }

    if (params.created_to) {
      query = query.lte('created_at', params.created_to)
    }

    const { data, error, count } = await query
      .order(params.order_by ?? 'created_at', { ascending: params.order_direction === 'asc' })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar os clientes')

    const customerIds = (data ?? []).map(customer => customer.id)
    let addressMap = new Map<string, CustomerAddressRow>()

    if (customerIds.length) {
      const { data: addresses, error: addressError } = await client
        .from('customer_addresses')
        .select('*')
        .in('customer_id', customerIds)
        .eq('is_primary', true)

      assertSupabaseResult(addressError, 'Não foi possível carregar os endereços dos clientes')
      addressMap = new Map((addresses ?? []).map(address => [address.customer_id, address]))
    }

    const items = (data ?? []).map(customer => mapCustomer(customer, addressMap.get(customer.id) ?? null))
    return buildPaginatedResponse(items, count ?? 0, params)
  }

  const getById = async (id: string): Promise<Customer> => {
    const { data: customer, error } = await client
      .from('customers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    assertSupabaseResult(error, 'Não foi possível carregar o cliente')

    const { data: address, error: addressError } = await client
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', id)
      .eq('is_primary', true)
      .maybeSingle()

    assertSupabaseResult(addressError, 'Não foi possível carregar o endereço do cliente')

    return mapCustomer(customer, address)
  }

  const create = async (data: CustomerFormData): Promise<Customer> => {
    const payload = customerFormSchema.parse(data)

    const { data: customer, error } = await client
      .from('customers')
      .insert({
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        mobile: payload.mobile || null,
        whatsapp: payload.whatsapp || null,
        document: payload.document || null,
        document_type: payload.document_type ?? null,
        birth_date: payload.birth_date || null,
        gender: payload.gender ?? null,
        notes: payload.notes || null,
        tags: payload.tags ?? [],
        status: payload.status ?? 'active',
        created_by: user.value?.id ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível criar o cliente')

    let address: CustomerAddressRow | null = null

    if (payload.address?.street && payload.address.city && payload.address.state) {
      const { data: addressData, error: addressError } = await client
        .from('customer_addresses')
        .insert({
          customer_id: customer.id,
          street: payload.address.street,
          number: payload.address.number ?? null,
          complement: payload.address.complement ?? null,
          neighborhood: payload.address.neighborhood ?? null,
          city: payload.address.city,
          state: payload.address.state,
          postal_code: payload.address.postal_code ?? null,
          country: payload.address.country ?? 'Brasil',
          is_primary: true,
        })
        .select('*')
        .single()

      assertSupabaseResult(addressError, 'Cliente criado, mas o endereço principal não foi salvo')
      address = addressData
    }

    return mapCustomer(customer, address)
  }

  const update = async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
    const payload = customerUpdateSchema.parse(data)

    const customerUpdateData = {
      name: payload.name,
      email: payload.email || null,
      phone: payload.phone || null,
      mobile: payload.mobile || null,
      whatsapp: payload.whatsapp || null,
      document: payload.document || null,
      document_type: payload.document_type ?? null,
      birth_date: payload.birth_date || null,
      gender: payload.gender ?? null,
      notes: payload.notes || null,
      tags: payload.tags,
      status: payload.status,
    }

    const { data: customer, error } = await client
      .from('customers')
      .update(customerUpdateData)
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível atualizar o cliente')

    if (payload.address && payload.address.street && payload.address.city && payload.address.state) {
      const { data: existingAddress } = await client
        .from('customer_addresses')
        .select('id')
        .eq('customer_id', id)
        .eq('is_primary', true)
        .maybeSingle()

      if (existingAddress?.id) {
        const { error: addressError } = await client
          .from('customer_addresses')
          .update({
            street: payload.address.street,
            number: payload.address.number ?? null,
            complement: payload.address.complement ?? null,
            neighborhood: payload.address.neighborhood ?? null,
            city: payload.address.city,
            state: payload.address.state,
            postal_code: payload.address.postal_code ?? null,
            country: payload.address.country ?? 'Brasil',
          })
          .eq('id', existingAddress.id)

        assertSupabaseResult(addressError, 'Cliente atualizado, mas o endereço principal não foi salvo')
      }
      else {
        const { error: addressError } = await client
          .from('customer_addresses')
          .insert({
            customer_id: id,
            street: payload.address.street,
            number: payload.address.number ?? null,
            complement: payload.address.complement ?? null,
            neighborhood: payload.address.neighborhood ?? null,
            city: payload.address.city,
            state: payload.address.state,
            postal_code: payload.address.postal_code ?? null,
            country: payload.address.country ?? 'Brasil',
            is_primary: true,
          })

        assertSupabaseResult(addressError, 'Cliente atualizado, mas o endereço principal não foi salvo')
      }
    }

    return getById(customer.id)
  }

  const deactivate = async (id: string): Promise<Customer> => {
    const { data, error } = await client
      .from('customers')
      .update({
        status: 'inactive',
      })
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível desativar o cliente')
    return getById(data.id)
  }

  const remove = async (id: string): Promise<void> => {
    const { error } = await client
      .from('customers')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'inactive',
      })
      .eq('id', id)

    assertSupabaseResult(error, 'Não foi possível arquivar o cliente')
  }

  const listAddresses = async (customerId: string) => {
    const { data, error } = await client
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('is_primary', { ascending: false })

    assertSupabaseResult(error, 'Não foi possível carregar os endereços do cliente')
    return data ?? []
  }

  const saveNote = async (customerId: string, note: string) => {
    const { data, error } = await client
      .from('customer_notes')
      .insert({
        customer_id: customerId,
        note,
        created_by: user.value?.id ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível salvar a observação do cliente')
    return data
  }

  const getStats = async (): Promise<CustomerStats> => {
    const { data, error } = await client
      .from('customers')
      .select('status, total_orders, created_at')
      .is('deleted_at', null)

    assertSupabaseResult(error, 'Não foi possível carregar as estatísticas de clientes')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const customers = data ?? []

    return {
      total: customers.length,
      active: customers.filter(customer => customer.status === 'active' || customer.status === 'vip').length,
      inactive: customers.filter(customer => customer.status === 'inactive' || customer.status === 'blocked').length,
      new_this_month: customers.filter(customer => new Date(customer.created_at) >= startOfMonth).length,
      with_orders: customers.filter(customer => customer.total_orders > 0).length,
    }
  }

  return {
    list,
    getById,
    create,
    update,
    deactivate,
    remove,
    listAddresses,
    saveNote,
    getStats,
  }
}
