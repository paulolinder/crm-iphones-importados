import type { Product, ProductFilters } from '../types'

export function useProducts() {
  const service = useProductsService()
  const { data, isLoading, error, setData, setLoading, setError, addItem, updateItem } = useCrudState<Product>()
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters<ProductFilters>({
    defaultFilters: {
      search: '',
      category_id: undefined,
      brand_id: undefined,
      status: undefined,
      stock_status: undefined,
    },
  })
  const pagination = usePagination({ defaultPerPage: 12 })

  const loadProducts = async () => {
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

  const createProduct = async (payload: Parameters<typeof service.create>[0]) => {
    setLoading(true, 'create')

    try {
      const product = await service.create(payload)
      addItem(product)
      return product
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  const updateProduct = async (id: string, payload: Parameters<typeof service.update>[1]) => {
    setLoading(true, 'update')

    try {
      const product = await service.update(id, payload)
      updateItem(id, product)
      return product
    }
    catch (e) {
      setError(e as Error)
      throw e
    }
  }

  return {
    products: data,
    loading: isLoading,
    error,
    filters,
    pagination,
    hasActiveFilters,
    loadProducts,
    createProduct,
    updateProduct,
    updateFilters,
    clearFilters,
  }
}
