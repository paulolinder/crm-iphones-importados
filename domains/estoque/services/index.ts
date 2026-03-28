import type { ProductStock, StockEntryFormData, StockExitFormData, StockFilters, StockMovement, StockStats } from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'
import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult, buildPaginatedResponse, normalizeCurrencyValue } from '../../shared/service-utils'
import { stockEntrySchema, stockExitSchema } from '../validation'

type InventoryItemRow = Tables<'inventory_items'>
type InventoryMovementRow = Tables<'inventory_movements'>
type ProductRow = Tables<'products'>
type ProfileRow = Tables<'profiles'>
type DeviceUnitRow = Tables<'device_units'>

function computeStockStatus(quantity: number, minStock: number): ProductStock['status'] {
  if (quantity === 0) {
    return 'out_of_stock'
  }

  if (quantity <= minStock) {
    return 'low_stock'
  }

  return 'in_stock'
}

export function useInventoryService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const listStock = async (
    params: PaginationParams & StockFilters = {},
  ): Promise<PaginatedResponse<ProductStock>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 10
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let inventoryQuery = client
      .from('inventory_items')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(from, to)

    const { data: inventoryItems, error, count } = await inventoryQuery
    assertSupabaseResult(error, 'Não foi possível carregar o estoque')

    const productIds = (inventoryItems ?? []).map(item => item.product_id)
    const { data: products, error: productError } = productIds.length
      ? await client.from('products').select('*').in('id', productIds)
      : { data: [], error: null }

    assertSupabaseResult(productError, 'Não foi possível carregar os produtos do estoque')

    const productMap = new Map((products ?? []).map(product => [product.id, product]))

    let rows = (inventoryItems ?? []).map((item) => {
      const product = productMap.get(item.product_id)

      return {
        id: item.id,
        product_id: item.product_id,
        product_name: product?.name ?? 'Produto sem nome',
        sku: product?.sku ?? null,
        quantity: item.quantity,
        reserved: item.reserved_quantity,
        available: item.quantity - item.reserved_quantity,
        min_stock: item.min_stock,
        max_stock: item.max_stock,
        status: computeStockStatus(item.quantity, item.min_stock),
        last_movement_at: item.last_movement_at,
        average_cost: item.average_cost,
        total_value: normalizeCurrencyValue(item.average_cost) * item.quantity,
      } satisfies ProductStock
    })

    if (params.search) {
      const normalizedSearch = params.search.toLowerCase()
      rows = rows.filter(row =>
        row.product_name.toLowerCase().includes(normalizedSearch)
        || row.sku?.toLowerCase().includes(normalizedSearch),
      )
    }

    if (params.status) {
      rows = rows.filter(row => row.status === params.status)
    }

    return buildPaginatedResponse(rows, count ?? rows.length, params)
  }

  const listMovements = async (params: PaginationParams = {}): Promise<PaginatedResponse<StockMovement>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 10
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data: movements, error, count } = await client
      .from('inventory_movements')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar as movimentações')

    const productIds = Array.from(new Set((movements ?? []).map(item => item.product_id)))
    const userIds = Array.from(new Set((movements ?? []).map(item => item.performed_by).filter(Boolean))) as string[]

    const [{ data: products }, { data: users }] = await Promise.all([
      productIds.length ? client.from('products').select('id, name, sku').in('id', productIds) : Promise.resolve({ data: [], error: null }),
      userIds.length ? client.from('profiles').select('id, full_name').in('id', userIds) : Promise.resolve({ data: [], error: null }),
    ])

    const productMap = new Map((products ?? []).map(product => [product.id, product]))
    const userMap = new Map((users ?? []).map(profile => [profile.id, profile]))

    const items = (movements ?? []).map((movement) => {
      const product = productMap.get(movement.product_id)
      const profile = movement.performed_by ? userMap.get(movement.performed_by) : null

      return {
        id: movement.id,
        created_at: movement.created_at,
        updated_at: movement.updated_at,
        product_id: movement.product_id,
        type: movement.movement_type,
        quantity: movement.quantity,
        previous_quantity: movement.previous_quantity,
        new_quantity: movement.new_quantity,
        unit_cost: movement.unit_cost,
        total_cost: movement.total_cost,
        reference_type: movement.reference_type as StockMovement['reference_type'],
        reference_id: movement.reference_id,
        imei: null,
        serial_number: null,
        notes: movement.notes,
        user_id: movement.performed_by ?? '',
        product: product ? { id: product.id, name: product.name, sku: product.sku } : undefined,
        user: profile ? { id: profile.id, name: profile.full_name ?? 'Usuário' } : undefined,
      } satisfies StockMovement
    })

    return buildPaginatedResponse(items, count ?? items.length, params)
  }

  const ensureInventoryItem = async (productId: string) => {
    const { data: item, error } = await client
      .from('inventory_items')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível localizar o item de estoque')

    if (item) {
      return item
    }

    const { data: createdItem, error: createError } = await client
      .from('inventory_items')
      .insert({
        product_id: productId,
        quantity: 0,
        reserved_quantity: 0,
        min_stock: 0,
      })
      .select('*')
      .single()

    assertSupabaseResult(createError, 'Não foi possível inicializar o item de estoque')
    return createdItem
  }

  const createDeviceUnits = async (
    productId: string,
    inventoryItemId: string,
    imeis: string[],
    unitCost: number | undefined,
    supplierId?: string,
  ) => {
    for (const imei of imeis) {
      const { data: deviceUnit, error: deviceUnitError } = await client
        .from('device_units')
        .insert({
          product_id: productId,
          inventory_item_id: inventoryItemId,
          supplier_id: supplierId ?? null,
          status: 'available',
          cost_price: unitCost ?? null,
        })
        .select('*')
        .single()

      assertSupabaseResult(deviceUnitError, 'Não foi possível registrar a unidade física do aparelho')

      const { error: identifierError } = await client
        .from('device_identifiers')
        .insert({
          device_unit_id: deviceUnit.id,
          identifier_type: 'imei',
          identifier_value: imei,
        })

      assertSupabaseResult(identifierError, 'Não foi possível registrar o identificador do aparelho')

      const { error: imeiError } = await client
        .from('imei_records')
        .insert({
          device_unit_id: deviceUnit.id,
          imei,
          status: 'available',
        })

      assertSupabaseResult(imeiError, 'Não foi possível registrar o IMEI do aparelho')
    }
  }

  const registerEntry = async (input: StockEntryFormData) => {
    const payload = stockEntrySchema.parse(input)
    const inventoryItem = await ensureInventoryItem(payload.product_id)
    const nextQuantity = inventoryItem.quantity + payload.quantity
    const totalCost = normalizeCurrencyValue(payload.unit_cost) * payload.quantity
    const entryNumber = `ENT-${Date.now()}`

    const { data: purchaseEntry, error: purchaseEntryError } = await client
      .from('purchase_entries')
      .insert({
        supplier_id: payload.supplier_id ?? null,
        entry_number: entryNumber,
        invoice_number: payload.invoice_number ?? null,
        status: 'received',
        total_cost: totalCost,
        created_by: user.value?.id ?? null,
        notes: payload.notes ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(purchaseEntryError, 'Não foi possível registrar a entrada de compra')

    const { data: purchaseItem, error: purchaseItemError } = await client
      .from('purchase_entry_items')
      .insert({
        purchase_entry_id: purchaseEntry.id,
        product_id: payload.product_id,
        quantity: payload.quantity,
        unit_cost: payload.unit_cost ?? 0,
        total_cost: totalCost,
      })
      .select('*')
      .single()

    assertSupabaseResult(purchaseItemError, 'Não foi possível registrar os itens da entrada')

    const nextAverageCost = payload.unit_cost ?? inventoryItem.average_cost ?? 0

    const { data: updatedInventory, error: inventoryError } = await client
      .from('inventory_items')
      .update({
        quantity: nextQuantity,
        average_cost: nextAverageCost,
        last_movement_at: new Date().toISOString(),
      })
      .eq('id', inventoryItem.id)
      .select('*')
      .single()

    assertSupabaseResult(inventoryError, 'Não foi possível atualizar o saldo de estoque')

    const { data: movement, error: movementError } = await client
      .from('inventory_movements')
      .insert({
        inventory_item_id: inventoryItem.id,
        product_id: payload.product_id,
        movement_type: 'entry',
        quantity: payload.quantity,
        previous_quantity: inventoryItem.quantity,
        new_quantity: nextQuantity,
        unit_cost: payload.unit_cost ?? null,
        total_cost: totalCost,
        reference_type: 'purchase_entry',
        reference_id: purchaseItem.id,
        notes: payload.notes ?? null,
        performed_by: user.value?.id ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(movementError, 'Não foi possível registrar a movimentação de entrada')

    if (payload.imeis?.length) {
      await createDeviceUnits(payload.product_id, updatedInventory.id, payload.imeis, payload.unit_cost, payload.supplier_id)
    }

    return movement
  }

  const registerMovement = async (input: StockExitFormData) => {
    const payload = stockExitSchema.parse(input)
    const inventoryItem = await ensureInventoryItem(payload.product_id)

    if (inventoryItem.quantity < payload.quantity) {
      throw new Error('Saldo insuficiente para registrar a saída')
    }

    const nextQuantity = inventoryItem.quantity - payload.quantity

    const { data: updatedInventory, error: inventoryError } = await client
      .from('inventory_items')
      .update({
        quantity: nextQuantity,
        last_movement_at: new Date().toISOString(),
      })
      .eq('id', inventoryItem.id)
      .select('*')
      .single()

    assertSupabaseResult(inventoryError, 'Não foi possível atualizar o saldo de estoque')

    const { data: movement, error: movementError } = await client
      .from('inventory_movements')
      .insert({
        inventory_item_id: inventoryItem.id,
        product_id: payload.product_id,
        movement_type: 'exit',
        quantity: payload.quantity,
        previous_quantity: inventoryItem.quantity,
        new_quantity: nextQuantity,
        reference_type: payload.reason,
        reference_id: payload.reference_id ?? null,
        notes: payload.notes ?? null,
        performed_by: user.value?.id ?? null,
      })
      .select('*')
      .single()

    assertSupabaseResult(movementError, 'Não foi possível registrar a movimentação de saída')

    if (payload.imeis?.length) {
      const { data: imeiRows, error: imeiError } = await client
        .from('imei_records')
        .select('device_unit_id')
        .in('imei', payload.imeis)

      assertSupabaseResult(imeiError, 'Não foi possível localizar os IMEIs informados')

      const deviceUnitIds = (imeiRows ?? []).map(row => row.device_unit_id)

      if (deviceUnitIds.length) {
        const nextStatus: DeviceUnitRow['status'] = payload.reason === 'sale' ? 'sold' : 'returned'

        const { error: deviceUnitError } = await client
          .from('device_units')
          .update({
            status: nextStatus,
            sold_at: payload.reason === 'sale' ? new Date().toISOString() : null,
          })
          .in('id', deviceUnitIds)

        assertSupabaseResult(deviceUnitError, 'Não foi possível atualizar o status das unidades físicas')

        const { error: imeiStatusError } = await client
          .from('imei_records')
          .update({ status: nextStatus })
          .in('imei', payload.imeis)

        assertSupabaseResult(imeiStatusError, 'Não foi possível atualizar o status dos IMEIs')
      }
    }

    return { movement, inventory: updatedInventory }
  }

  const getStats = async (): Promise<StockStats> => {
    const { data: inventoryItems, error } = await client
      .from('inventory_items')
      .select('product_id, quantity, min_stock, average_cost')

    assertSupabaseResult(error, 'Não foi possível carregar as estatísticas de estoque')

    const rows = inventoryItems ?? []

    return {
      total_products: rows.length,
      total_items: rows.reduce((sum, item) => sum + item.quantity, 0),
      low_stock_count: rows.filter(item => item.quantity > 0 && item.quantity <= item.min_stock).length,
      out_of_stock_count: rows.filter(item => item.quantity === 0).length,
      total_value: rows.reduce((sum, item) => sum + normalizeCurrencyValue(item.average_cost) * item.quantity, 0),
    }
  }

  return {
    listStock,
    listMovements,
    registerEntry,
    registerMovement,
    getStats,
  }
}
