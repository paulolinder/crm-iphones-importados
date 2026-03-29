import type { Order, OrderFilters } from '../types'

export function useOrders() {
  const service = useOrdersService()
  const { data, isLoading, error, setData, setLoading, setError, addItem, updateItem } = useCrudState<Order>()
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters<OrderFilters>({
    defaultFilters: {
      search: '',
      status: undefined,
      payment_status: undefined,
      customer_id: undefined,
      seller_id: undefined,
      date_from: undefined,
      date_to: undefined,
    },
  })
  const pagination = usePagination()

  const loadOrders = async () => {
    setLoading(true, 'read')

    try {
      const response = await service.list({
        page: pagination.currentPage.value,
        per_page: pagination.perPage.value,
        ...filters.value,
      })

      setData(response.data)
      pagination.setTotal(response.meta.total)
    }
    catch (e) {
      setError(e as Error)
    }
  }

  const createOrder = async (payload: Parameters<typeof service.create>[0]) => {
    setLoading(true, 'create')

    try {
      const order = await service.create(payload)
      addItem(order)
      return order
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  const updateOrderStatus = async (id: string, status: Parameters<typeof service.updateStatus>[1], notes?: string) => {
    setLoading(true, 'update')

    try {
      const order = await service.updateStatus(id, status, notes)
      updateItem(id, order)
      return order
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  return {
    orders: data,
    loading: isLoading,
    error,
    filters,
    pagination,
    hasActiveFilters,
    loadOrders,
    createOrder,
    updateOrderStatus,
    updateFilters,
    clearFilters,
  }
}
