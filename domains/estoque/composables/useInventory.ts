import type { ProductStock, StockFilters, StockMovement } from '../types'

export function useInventory() {
  const service = useInventoryService()
  const stockState = useCrudState<ProductStock>()
  const movementState = useCrudState<StockMovement>()
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters<StockFilters>({
    defaultFilters: {
      search: '',
      status: undefined,
    },
  })
  const pagination = usePagination()

  const loadStock = async () => {
    stockState.setLoading(true, 'read')

    try {
      const response = await service.listStock({
        page: pagination.currentPage.value,
        per_page: pagination.perPage.value,
        ...filters.value,
      })

      stockState.setData(response.data)
      pagination.setTotal(response.meta.total)
    }
    catch (e) {
      stockState.setError(e as Error)
    }
  }

  const loadMovements = async () => {
    movementState.setLoading(true, 'read')

    try {
      const response = await service.listMovements({
        page: pagination.currentPage.value,
        per_page: pagination.perPage.value,
      })

      movementState.setData(response.data)
    }
    catch (e) {
      movementState.setError(e as Error)
    }
  }

  return {
    stockItems: stockState.data,
    stockLoading: stockState.isLoading,
    stockError: stockState.error,
    movements: movementState.data,
    movementsLoading: movementState.isLoading,
    movementsError: movementState.error,
    filters,
    pagination,
    hasActiveFilters,
    loadStock,
    loadMovements,
    registerEntry: service.registerEntry,
    registerMovement: service.registerMovement,
    updateFilters,
    clearFilters,
  }
}
