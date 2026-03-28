/**
 * useCrudState
 *
 * Composable para gerenciar estados de CRUD
 */

type CrudOperation = 'create' | 'read' | 'update' | 'delete'

interface CrudState<T> {
  data: T[]
  selectedItem: T | null
  loading: boolean
  error: Error | null
  operation: CrudOperation | null
}

export function useCrudState<T extends { id: string }>(initialData: T[] = []) {
  const state = reactive<CrudState<T>>({
    data: initialData,
    selectedItem: null,
    loading: false,
    error: null,
    operation: null,
  })

  const isLoading = computed(() => state.loading)
  const hasError = computed(() => state.error !== null)
  const isEmpty = computed(() => state.data.length === 0)
  const currentOperation = computed(() => state.operation)

  const setLoading = (loading: boolean, operation?: CrudOperation) => {
    state.loading = loading
    state.operation = loading ? operation ?? null : null
    if (loading) {
      state.error = null
    }
  }

  const setError = (error: Error | null) => {
    state.error = error
    state.loading = false
  }

  const setData = (data: T[]) => {
    state.data = data
    state.loading = false
    state.error = null
  }

  const addItem = (item: T) => {
    state.data.unshift(item)
  }

  const updateItem = (id: string, updates: Partial<T>) => {
    const index = state.data.findIndex((item) => item.id === id)
    if (index !== -1) {
      state.data[index] = { ...state.data[index], ...updates }
    }
  }

  const removeItem = (id: string) => {
    const index = state.data.findIndex((item) => item.id === id)
    if (index !== -1) {
      state.data.splice(index, 1)
    }
  }

  const selectItem = (item: T | null) => {
    state.selectedItem = item
  }

  const clearSelection = () => {
    state.selectedItem = null
  }

  const reset = () => {
    state.data = []
    state.selectedItem = null
    state.loading = false
    state.error = null
    state.operation = null
  }

  const findById = (id: string): T | undefined => {
    return state.data.find((item) => item.id === id)
  }

  return {
    state: readonly(state),
    data: computed(() => state.data),
    selectedItem: computed(() => state.selectedItem),
    isLoading,
    hasError,
    isEmpty,
    currentOperation,
    setLoading,
    setError,
    setData,
    addItem,
    updateItem,
    removeItem,
    selectItem,
    clearSelection,
    reset,
    findById,
  }
}
