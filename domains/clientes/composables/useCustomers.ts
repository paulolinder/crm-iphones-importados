/**
 * useCustomers
 *
 * Composable principal do módulo de clientes
 */

import type { Customer, CustomerFilters } from '../types'

export function useCustomers() {
  const service = useCustomersService()
  const { data, loading, error, setData, setLoading, setError } = useCrudState<Customer>()
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters<CustomerFilters>({
    defaultFilters: {
      search: '',
      status: undefined,
    },
  })
  const pagination = usePagination()

  /**
   * Carrega lista de clientes
   */
  const loadCustomers = async () => {
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

  /**
   * Recarrega a lista
   */
  const refresh = () => {
    return loadCustomers()
  }

  return {
    customers: data,
    loading,
    error,
    filters,
    pagination,
    hasActiveFilters,
    loadCustomers,
    refresh,
    updateFilters,
    clearFilters,
  }
}
