import type { Order, OrderFilters, OrderFormData, OrderStats } from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'
import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse, normalizeCurrencyValue } from '../../shared/service-utils'
import { orderFormSchema, orderStatusUpdateSchema } from '../validation'

type OrderRow = Tables<'orders'>
type OrderItemRow = Tables<'order_items'>
type OrderPaymentRow = Tables<'order_payments'>
type CustomerRow = Tables<'customers'>
type ProfileRow = Tables<'profiles'>
type ProductRow = Tables<'products'>
type InventoryItemRow = Tables<'inventory_items'>

function mapOrder(
  order: OrderRow,
  options?: {
    customer?: CustomerRow | null
    seller?: ProfileRow | null
    items?: OrderItemRow[]
    payments?: OrderPaymentRow[]
  },
): Order {
  return {
    id: order.id,
    created_at: order.created_at,
    updated_at: order.updated_at,
    number: order.order_number,
    customer_id: order.customer_id,
    seller_id: order.seller_id,
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    subtotal: normalizeCurrencyValue(order.subtotal),
    discount: normalizeCurrencyValue(order.discount_amount),
    discount_type: order.discount_type as Order['discount_type'],
    shipping: normalizeCurrencyValue(order.shipping_amount),
    total: normalizeCurrencyValue(order.total_amount),
    notes: order.notes,
    internal_notes: order.internal_notes,
    commercial_document_path: order.commercial_document_path ?? null,
    commercial_document_updated_at: order.commercial_document_updated_at ?? null,
    shipped_at: order.shipped_at,
    delivered_at: order.delivered_at,
    cancelled_at: order.cancelled_at,
    cancellation_reason: order.cancellation_reason,
    customer: options?.customer
      ? {
          id: options.customer.id,
          name: options.customer.name,
          email: options.customer.email,
          phone: options.customer.phone,
        }
      : undefined,
    seller: options?.seller
      ? {
          id: options.seller.id,
          name: options.seller.full_name ?? options.seller.email,
        }
      : undefined,
    items: (options?.items ?? []).map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id ?? '',
      product_name: item.product_name,
      sku: item.sku,
      imei: null,
      quantity: item.quantity,
      unit_price: normalizeCurrencyValue(item.unit_price),
      discount: normalizeCurrencyValue(item.discount_amount),
      total: normalizeCurrencyValue(item.total_amount),
      warranty_until: item.warranty_until,
    })),
    payments: (options?.payments ?? []).map(payment => ({
      id: payment.id,
      order_id: payment.order_id,
      method: payment.method,
      amount: normalizeCurrencyValue(payment.amount),
      paid_at: payment.paid_at,
      installments: payment.installment_count,
      notes: payment.notes,
    })),
  }
}

export function useOrdersService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const list = async (
    params: PaginationParams & OrderFilters = {},
  ): Promise<PaginatedResponse<Order>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 10
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = client
      .from('orders')
      .select('*', { count: 'exact' })

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.payment_status) {
      query = query.eq('payment_status', params.payment_status)
    }

    if (params.customer_id) {
      query = query.eq('customer_id', params.customer_id)
    }

    if (params.seller_id) {
      query = query.eq('seller_id', params.seller_id)
    }

    if (params.date_from) {
      query = query.gte('created_at', params.date_from)
    }

    if (params.date_to) {
      query = query.lte('created_at', params.date_to)
    }

    const { data: orders, error, count } = await query
      .order(params.order_by ?? 'created_at', { ascending: params.order_direction === 'asc' })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar os pedidos')

    const orderIds = (orders ?? []).map(order => order.id)
    const customerIds = Array.from(new Set((orders ?? []).map(order => order.customer_id)))
    const sellerIds = Array.from(new Set((orders ?? []).map(order => order.seller_id).filter(Boolean))) as string[]

    const [{ data: customers }, { data: sellers }, { data: items }, { data: payments }] = await Promise.all([
      customerIds.length ? client.from('customers').select('id, name, email, phone').in('id', customerIds) : Promise.resolve({ data: [], error: null }),
      sellerIds.length ? client.from('profiles').select('id, full_name, email').in('id', sellerIds) : Promise.resolve({ data: [], error: null }),
      orderIds.length ? client.from('order_items').select('*').in('order_id', orderIds) : Promise.resolve({ data: [], error: null }),
      orderIds.length ? client.from('order_payments').select('*').in('order_id', orderIds) : Promise.resolve({ data: [], error: null }),
    ])

    const customerMap = new Map((customers ?? []).map(customer => [customer.id, customer]))
    const sellerMap = new Map((sellers ?? []).map(seller => [seller.id, seller]))
    const itemsMap = new Map<string, OrderItemRow[]>()
    const paymentsMap = new Map<string, OrderPaymentRow[]>()

    for (const item of items ?? []) {
      const current = itemsMap.get(item.order_id) ?? []
      current.push(item)
      itemsMap.set(item.order_id, current)
    }

    for (const payment of payments ?? []) {
      const current = paymentsMap.get(payment.order_id) ?? []
      current.push(payment)
      paymentsMap.set(payment.order_id, current)
    }

    let rows = (orders ?? []).map(order => mapOrder(order, {
      customer: customerMap.get(order.customer_id) ?? null,
      seller: order.seller_id ? sellerMap.get(order.seller_id) ?? null : null,
      items: itemsMap.get(order.id) ?? [],
      payments: paymentsMap.get(order.id) ?? [],
    }))

    if (params.search) {
      const normalizedSearch = params.search.toLowerCase()
      rows = rows.filter(order =>
        order.number.toLowerCase().includes(normalizedSearch)
        || order.customer?.name.toLowerCase().includes(normalizedSearch),
      )
    }

    return buildPaginatedResponse(rows, count ?? rows.length, params)
  }

  const getById = async (id: string) => {
    const { data: order, error } = await client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    assertSupabaseResult(error, 'Não foi possível carregar o pedido')

    const [{ data: customer }, { data: seller }, { data: items }, { data: payments }] = await Promise.all([
      client.from('customers').select('id, name, email, phone').eq('id', order.customer_id).maybeSingle(),
      order.seller_id
        ? client.from('profiles').select('id, full_name, email').eq('id', order.seller_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      client.from('order_items').select('*').eq('order_id', order.id),
      client.from('order_payments').select('*').eq('order_id', order.id),
    ])

    return mapOrder(order, {
      customer: customer ?? null,
      seller: seller ?? null,
      items: items ?? [],
      payments: payments ?? [],
    })
  }

  const create = async (input: OrderFormData) => {
    const payload = orderFormSchema.parse(input)
    const orderNumber = `#${Date.now().toString().slice(-6)}`
    const productIds = payload.items.map(item => item.product_id)
    const { data: products, error: productsError } = await client
      .from('products')
      .select('*')
      .in('id', productIds)

    assertSupabaseResult(productsError, 'Não foi possível carregar os produtos do pedido')

    const productMap = new Map((products ?? []).map(product => [product.id, product]))

    const subtotal = payload.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
    const itemsDiscount = payload.items.reduce((sum, item) => sum + normalizeCurrencyValue(item.discount), 0)
    const manualDiscount = normalizeCurrencyValue(payload.discount)
    const discountAmount = payload.discount_type === 'percentage'
      ? subtotal * (manualDiscount / 100)
      : manualDiscount
    const shippingAmount = normalizeCurrencyValue(payload.shipping)
    const totalAmount = subtotal - discountAmount - itemsDiscount + shippingAmount

    const { data: order, error } = await client
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: payload.customer_id,
        seller_id: payload.seller_id ?? user.value?.id ?? null,
        status: 'pending',
        payment_status: payload.payment_method ? 'pending' : 'pending',
        payment_method: payload.payment_method ?? null,
        subtotal,
        discount_amount: discountAmount + itemsDiscount,
        discount_type: payload.discount_type ?? null,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        notes: payload.notes ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível criar o pedido')

    const orderItemsPayload = payload.items.map((item) => {
      const product = productMap.get(item.product_id)
      const itemDiscount = normalizeCurrencyValue(item.discount)
      const total = (item.unit_price * item.quantity) - itemDiscount

      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product?.name ?? 'Produto',
        sku: product?.sku ?? null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: itemDiscount,
        total_amount: total,
        cost_amount: product?.cost_price ?? null,
        warranty_until: product?.warranty_months
          ? new Date(Date.now() + (product.warranty_months * 30 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
          : null,
      }
    })

    const { data: insertedItems, error: itemsError } = await client
      .from('order_items')
      .insert(orderItemsPayload)
      .select('*')

    assertSupabaseResult(itemsError, 'Não foi possível criar os itens do pedido')

    const { error: statusHistoryError } = await client
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: order.status,
        notes: 'Pedido criado',
        changed_by: user.value?.id ?? null,
      })

    assertSupabaseResult(statusHistoryError, 'Pedido criado, mas o histórico de status não foi salvo')

    const { error: receivableError } = await client
      .from('accounts_receivable')
      .insert({
        customer_id: payload.customer_id,
        order_id: order.id,
        description: `Pedido ${order.order_number}`,
        amount: totalAmount,
        due_date: new Date().toISOString().slice(0, 10),
        status: 'pending',
      })

    if (receivableError) {
      console.warn('[orders] Conta a receber não registrada (permissão financeiro ou RLS):', receivableError.message)
    }

    if (payload.payment_method) {
      const { error: paymentError } = await client
        .from('order_payments')
        .insert({
          order_id: order.id,
          method: payload.payment_method,
          status: 'pending',
          amount: totalAmount,
        })

      assertSupabaseResult(paymentError, 'Pedido criado, mas o registro de pagamento não foi salvo')
    }

    const { data: customer, error: customerError } = await client
      .from('customers')
      .select('total_orders, total_spent')
      .eq('id', payload.customer_id)
      .single()

    assertSupabaseResult(customerError, 'Pedido criado, mas o cliente não pôde ser atualizado')

    const { error: customerUpdateError } = await client
      .from('customers')
      .update({
        total_orders: customer.total_orders + 1,
        total_spent: normalizeCurrencyValue(customer.total_spent) + totalAmount,
        last_purchase_at: new Date().toISOString(),
      })
      .eq('id', payload.customer_id)

    assertSupabaseResult(customerUpdateError, 'Pedido criado, mas os indicadores do cliente não foram atualizados')

    const inventoryRowsByProduct = new Map<string, InventoryItemRow>()
    const { data: inventoryRows, error: inventoryRowsError } = await client
      .from('inventory_items')
      .select('*')
      .in('product_id', productIds)

    assertSupabaseResult(inventoryRowsError, 'Pedido criado, mas o estoque não pôde ser sincronizado')

    for (const inventoryRow of inventoryRows ?? []) {
      inventoryRowsByProduct.set(inventoryRow.product_id, inventoryRow)
    }

    for (const item of payload.items) {
      const inventory = inventoryRowsByProduct.get(item.product_id)

      if (!inventory) {
        continue
      }

      const nextQuantity = Math.max(inventory.quantity - item.quantity, 0)

      const { error: inventoryUpdateError } = await client
        .from('inventory_items')
        .update({
          quantity: nextQuantity,
          last_movement_at: new Date().toISOString(),
        })
        .eq('id', inventory.id)

      assertSupabaseResult(inventoryUpdateError, 'Pedido criado, mas o estoque não foi atualizado')

      const { error: movementError } = await client
        .from('inventory_movements')
        .insert({
          inventory_item_id: inventory.id,
          product_id: item.product_id,
          movement_type: 'exit',
          quantity: item.quantity,
          previous_quantity: inventory.quantity,
          new_quantity: nextQuantity,
          reference_type: 'sale',
          reference_id: order.id,
          notes: `Saída vinculada ao pedido ${order.order_number}`,
          performed_by: user.value?.id ?? null,
        })

      assertSupabaseResult(movementError, 'Pedido criado, mas a movimentação de estoque não foi registrada')

      if (item.imei) {
        const { data: imeiRow, error: imeiError } = await client
          .from('imei_records')
          .select('device_unit_id')
          .eq('imei', item.imei)
          .maybeSingle()

        assertSupabaseResult(imeiError, 'Pedido criado, mas o IMEI informado não pôde ser localizado')

        if (imeiRow?.device_unit_id) {
          const soldAt = new Date().toISOString()

          const { error: deviceUnitError } = await client
            .from('device_units')
            .update({
              status: 'sold',
              sold_at: soldAt,
            })
            .eq('id', imeiRow.device_unit_id)

          assertSupabaseResult(deviceUnitError, 'Pedido criado, mas a unidade física não foi marcada como vendida')

          const { error: imeiStatusError } = await client
            .from('imei_records')
            .update({ status: 'sold' })
            .eq('imei', item.imei)

          assertSupabaseResult(imeiStatusError, 'Pedido criado, mas o IMEI não foi atualizado')
        }
      }
    }

    return getById(order.id)
  }

  const registerPayment = async (orderId: string, amount: number, method: Order['payment_method']) => {
    if (!method) {
      throw new Error('Método de pagamento é obrigatório')
    }

    const { data: orderRow, error: orderFetchError } = await client
      .from('orders')
      .select('id, order_number, payment_status')
      .eq('id', orderId)
      .single()

    assertSupabaseResult(orderFetchError, 'Não foi possível carregar o pedido')

    if (orderRow.payment_status === 'paid') {
      throw new Error('Este pedido já está marcado como pago')
    }

    const { data, error } = await client
      .from('order_payments')
      .insert({
        order_id: orderId,
        method,
        amount,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível registrar o pagamento')

    const { error: orderError } = await client
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_method: method,
      })
      .eq('id', orderId)

    assertSupabaseResult(orderError, 'Pagamento registrado, mas o status do pedido não foi atualizado')

    const occurredAt = new Date().toISOString()

    const { data: receivable } = await client
      .from('accounts_receivable')
      .select('id')
      .eq('order_id', orderId)
      .in('status', ['pending', 'partial'])
      .maybeSingle()

    const { error: txError } = await client
      .from('financial_transactions')
      .insert({
        transaction_type: 'income',
        description: `Recebimento ${orderRow.order_number}`,
        amount,
        occurred_at: occurredAt,
        category: 'vendas',
        order_id: orderId,
        accounts_receivable_id: receivable?.id ?? null,
        created_by: user.value?.id ?? null,
      })

    assertSupabaseResult(txError, 'Pagamento salvo, mas o lançamento no financeiro falhou')

    if (receivable?.id) {
      const { error: recvErr } = await client
        .from('accounts_receivable')
        .update({
          status: 'paid',
          received_at: occurredAt,
        })
        .eq('id', receivable.id)

      assertSupabaseResult(recvErr, 'Pagamento salvo, mas a baixa em contas a receber falhou')
    }

    return data
  }

  const updateStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    const payload = orderStatusUpdateSchema.parse({ status, notes })
    const patch: Partial<OrderRow> = {
      status: payload.status,
    }

    if (status === 'confirmed') patch.confirmed_at = new Date().toISOString()
    if (status === 'shipped') patch.shipped_at = new Date().toISOString()
    if (status === 'delivered') patch.delivered_at = new Date().toISOString()
    if (status === 'cancelled') {
      patch.cancelled_at = new Date().toISOString()
      if (notes) {
        patch.cancellation_reason = notes
      }
    }

    const { error } = await client
      .from('orders')
      .update(patch)
      .eq('id', orderId)

    assertSupabaseResult(error, 'Não foi possível atualizar o status do pedido')

    const { error: historyError } = await client
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        notes: payload.notes ?? null,
        changed_by: user.value?.id ?? null,
      })

    assertSupabaseResult(historyError, 'Status atualizado, mas o histórico não foi salvo')

    return getById(orderId)
  }

  const getStats = async (): Promise<OrderStats> => {
    const { data, error } = await client
      .from('orders')
      .select('status, payment_status, total_amount')

    assertSupabaseResult(error, 'Não foi possível carregar as estatísticas de pedidos')

    const rows = data ?? []
    const totalRevenue = rows
      .filter(row => row.status !== 'cancelled')
      .reduce((sum, row) => sum + normalizeCurrencyValue(row.total_amount), 0)

    return {
      total_orders: rows.length,
      total_revenue: totalRevenue,
      average_ticket: rows.length ? totalRevenue / rows.length : 0,
      pending_orders: rows.filter(row => row.status === 'pending').length,
      pending_payment: rows.filter(row => row.payment_status === 'pending').length,
    }
  }

  return {
    list,
    getById,
    create,
    registerPayment,
    updateStatus,
    getStats,
  }
}
