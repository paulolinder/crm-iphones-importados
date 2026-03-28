/**
 * usePagination
 *
 * Composable para gerenciar paginação
 */

interface UsePaginationOptions {
  defaultPage?: number
  defaultPerPage?: number
  perPageOptions?: number[]
}

export function usePagination(options: UsePaginationOptions = {}) {
  const {
    defaultPage = 1,
    defaultPerPage = 10,
    perPageOptions = [10, 25, 50, 100],
  } = options

  const route = useRoute()
  const router = useRouter()

  const currentPage = ref(defaultPage)
  const perPage = ref(defaultPerPage)
  const totalItems = ref(0)

  const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))

  const offset = computed(() => (currentPage.value - 1) * perPage.value)

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  const initFromQuery = () => {
    const page = Number(route.query.page)
    const limit = Number(route.query.per_page)

    if (!isNaN(page) && page > 0) {
      currentPage.value = page
    }

    if (!isNaN(limit) && perPageOptions.includes(limit)) {
      perPage.value = limit
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      syncToQuery()
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  const setPerPage = (value: number) => {
    perPage.value = value
    currentPage.value = 1
    syncToQuery()
  }

  const setTotal = (total: number) => {
    totalItems.value = total

    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  }

  const reset = () => {
    currentPage.value = defaultPage
    perPage.value = defaultPerPage
    totalItems.value = 0
    syncToQuery()
  }

  const syncToQuery = () => {
    const query = { ...route.query }

    if (currentPage.value === 1) {
      delete query.page
    }
    else {
      query.page = String(currentPage.value)
    }

    if (perPage.value === defaultPerPage) {
      delete query.per_page
    }
    else {
      query.per_page = String(perPage.value)
    }

    router.replace({ query })
  }

  onMounted(() => {
    initFromQuery()
  })

  return {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    offset,
    hasNextPage,
    hasPrevPage,
    perPageOptions,
    goToPage,
    nextPage,
    prevPage,
    setPerPage,
    setTotal,
    reset,
  }
}
