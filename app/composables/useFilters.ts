/**
 * useFilters
 *
 * Composable para gerenciar filtros de listagem
 */

type FilterRecord = object

interface UseFiltersOptions<T extends FilterRecord> {
  defaultFilters?: T
}

export function useFilters<T extends FilterRecord = FilterRecord>(
  options: UseFiltersOptions<T> = {}
) {
  const { defaultFilters = {} as T } = options
  const route = useRoute()
  const router = useRouter()

  const filters = ref<T>({ ...defaultFilters } as T)

  const initFromQuery = () => {
    const query = route.query
    const newFilters = { ...defaultFilters } as T

    Object.keys(query).forEach((key) => {
      if (key in defaultFilters || key === 'search') {
        const value = query[key]
        ;(newFilters as Record<string, unknown>)[key] = value
      }
    })

    filters.value = newFilters
  }

  const updateFilters = (newFilters: Partial<T>) => {
    filters.value = { ...filters.value, ...newFilters }
    syncToQuery()
  }

  const setFilter = (key: keyof T, value: unknown) => {
    ;(filters.value as Record<string, unknown>)[key as string] = value
    syncToQuery()
  }

  const clearFilters = () => {
    filters.value = { ...defaultFilters } as T
    syncToQuery()
  }

  const syncToQuery = () => {
    const query: Record<string, string> = {}

    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        query[key] = String(value)
      }
    })

    router.replace({ query })
  }

  const hasActiveFilters = computed(() => {
    return Object.entries(filters.value).some(([key, value]) => {
      const defaultValue = (defaultFilters as Record<string, unknown>)[key]
      return value !== defaultValue && value !== null && value !== '' && value !== undefined
    })
  })

  onMounted(() => {
    initFromQuery()
  })

  return {
    filters,
    updateFilters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  }
}
