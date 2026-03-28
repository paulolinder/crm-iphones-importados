<script setup lang="ts">
/**
 * BasePagination
 *
 * Componente de paginação reutilizável
 */

interface Props {
  currentPage: number
  totalPages: number
  totalItems?: number
  perPage?: number
  siblingCount?: number
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  siblingCount: 1,
  showInfo: true,
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

const currentPage = computed({
  get: () => props.currentPage,
  set: (value) => emit('update:currentPage', value),
})

const canGoPrev = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < props.totalPages)

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
  }
}

const pages = computed(() => {
  const total = props.totalPages
  const current = currentPage.value
  const sibling = props.siblingCount

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const leftSiblingIndex = Math.max(current - sibling, 1)
  const rightSiblingIndex = Math.min(current + sibling, total)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < total - 1

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, 3 + 2 * sibling)
    return [...leftRange, '...', total]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = range(total - (2 + 2 * sibling), total)
    return [1, '...', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [1, '...', ...middleRange, '...', total]
  }

  return range(1, total)
})

const startItem = computed(() => {
  if (!props.perPage) return 0
  return (currentPage.value - 1) * props.perPage + 1
})

const endItem = computed(() => {
  if (!props.perPage || !props.totalItems) return 0
  return Math.min(currentPage.value * props.perPage, props.totalItems)
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Info -->
    <p v-if="showInfo && totalItems && perPage" class="text-sm text-slate-500">
      Mostrando <span class="font-medium">{{ startItem }}</span> a
      <span class="font-medium">{{ endItem }}</span> de
      <span class="font-medium">{{ totalItems }}</span> registros
    </p>

    <!-- Pagination -->
    <nav class="flex items-center gap-1">
      <!-- Previous -->
      <button
        type="button"
        :disabled="!canGoPrev"
        class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(currentPage - 1)"
      >
        <Icon name="lucide:chevron-left" class="w-5 h-5" />
      </button>

      <!-- Pages -->
      <template v-for="(page, index) in pages" :key="index">
        <span
          v-if="page === '...'"
          class="px-2 text-slate-400"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          class="min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors"
          :class="page === currentPage
            ? 'bg-primary-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'"
          @click="goToPage(Number(page))"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        type="button"
        :disabled="!canGoNext"
        class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(currentPage + 1)"
      >
        <Icon name="lucide:chevron-right" class="w-5 h-5" />
      </button>
    </nav>
  </div>
</template>
