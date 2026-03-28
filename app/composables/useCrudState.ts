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
  const data = shallowRef<T[]>([...initialData])
  const selectedItem = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = shallowRef<Error | null>(null)
  const operation = shallowRef<CrudOperation | null>(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => data.value.length === 0)
  const currentOperation = computed(() => operation.value)

  const setLoading = (value: boolean, nextOperation?: CrudOperation) => {
    loading.value = value
    operation.value = value ? nextOperation ?? null : null

    if (value) {
      error.value = null
    }
  }

  const setError = (nextError: Error | null) => {
    error.value = nextError
    loading.value = false
  }

  const setData = (nextData: T[]) => {
    data.value = nextData
    loading.value = false
    error.value = null
  }

  const addItem = (item: T) => {
    data.value = [item, ...data.value]
  }

  const updateItem = (id: string, updates: Partial<T>) => {
    data.value = data.value.map(item => item.id === id ? { ...item, ...updates } : item)
  }

  const removeItem = (id: string) => {
    data.value = data.value.filter(item => item.id !== id)
  }

  const selectItem = (item: T | null) => {
    selectedItem.value = item
  }

  const clearSelection = () => {
    selectedItem.value = null
  }

  const reset = () => {
    data.value = []
    selectedItem.value = null
    loading.value = false
    error.value = null
    operation.value = null
  }

  const findById = (id: string): T | undefined => {
    return data.value.find(item => item.id === id)
  }

  return {
    state: computed<CrudState<T>>(() => ({
      data: data.value,
      selectedItem: selectedItem.value,
      loading: loading.value,
      error: error.value,
      operation: operation.value,
    })),
    data: readonly(data),
    selectedItem: readonly(selectedItem),
    error: readonly(error),
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
