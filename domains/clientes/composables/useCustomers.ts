/**
 * useCustomers
 *
 * Composable principal do módulo de clientes
 */

import type { Customer, CustomerFilters } from '../types'

export function useCustomers() {
  const service = useCustomersService()
  const { data, isLoading, error, setData, setLoading, setError, addItem, updateItem } = useCrudState<Customer>()
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

  const createCustomer = async (payload: Parameters<typeof service.create>[0]) => {
    setLoading(true, 'create')

    try {
      const customer = await service.create(payload)
      addItem(customer)
      return customer
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  const updateCustomer = async (id: string, payload: Parameters<typeof service.update>[1]) => {
    setLoading(true, 'update')

    try {
      const customer = await service.update(id, payload)
      updateItem(id, customer)
      return customer
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  const deactivateCustomer = async (id: string) => {
    setLoading(true, 'update')

    try {
      const customer = await service.deactivate(id)
      updateItem(id, customer)
      return customer
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  return {
    customers: data,
    loading: isLoading,
    error,
    filters,
    pagination,
    hasActiveFilters,
    loadCustomers,
    refresh,
    createCustomer,
    updateCustomer,
    deactivateCustomer,
    updateFilters,
    clearFilters,
  }
}
