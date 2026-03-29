<script setup lang="ts">
/**
 * BaseFilterBar
 *
 * Barra de filtros reutilizável
 */

import type { FilterField } from '~/types'

interface Props {
  filters: FilterField[]
  modelValue: Record<string, unknown>
  searchPlaceholder?: string
  showSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Buscar...',
  showSearch: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  'search': [value: string]
  'clear': []
}>()

const filterValues = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const searchValue = ref('')

const updateFilter = (key: string, value: unknown) => {
  emit('update:modelValue', { ...filterValues.value, [key]: value })
}

const clearFilters = () => {
  const emptyFilters: Record<string, unknown> = {}
  props.filters.forEach((f) => {
    emptyFilters[f.key] = f.defaultValue ?? null
  })
  emit('update:modelValue', emptyFilters)
  searchValue.value = ''
  emit('clear')
}

const hasActiveFilters = computed(() => {
  return Object.values(filterValues.value).some((v) => v !== null && v !== '' && v !== undefined)
})

const handleSearch = () => {
  emit('search', searchValue.value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
    <!-- Search -->
    <div v-if="showSearch" class="flex-1 min-w-[200px]">
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        />
        <input
          v-model="searchValue"
          type="text"
          :placeholder="searchPlaceholder"
          class="form-input pl-9"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <!-- Filter Fields -->
    <template v-for="filter in filters" :key="filter.key">
      <!-- Select -->
      <div v-if="filter.type === 'select'" class="w-40">
        <select
          :value="filterValues[filter.key]"
          class="form-select text-sm"
          @change="updateFilter(filter.key, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ filter.placeholder || filter.label }}</option>
          <option
            v-for="option in filter.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Date -->
      <div v-else-if="filter.type === 'date'" class="w-40">
        <input
          type="date"
          :value="filterValues[filter.key]"
          class="form-input text-sm"
          @change="updateFilter(filter.key, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </template>

    <!-- Clear Filters -->
    <button
      v-if="hasActiveFilters"
      type="button"
      class="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
      @click="clearFilters"
    >
      <Icon name="lucide:x" class="w-4 h-4" />
      Limpar filtros
    </button>
  </div>
</template>
