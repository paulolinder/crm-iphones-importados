<script setup lang="ts" generic="T extends Record<string, unknown>">
/**
 * BaseTable
 *
 * Componente base de tabela reutilizável
 */

import type { TableColumn, TableAction } from '~/types'

interface Props {
  columns: TableColumn<T>[]
  data: T[]
  actions?: TableAction<T>[]
  loading?: boolean
  selectable?: boolean
  selectedItems?: T[]
  rowKey?: string
  emptyTitle?: string
  emptyDescription?: string
  stickyHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: false,
  rowKey: 'id',
  emptyTitle: 'Nenhum registro encontrado',
  emptyDescription: 'Não há dados para exibir no momento.',
  stickyHeader: false,
})

const emit = defineEmits<{
  'update:selectedItems': [items: T[]]
  'row-click': [row: T]
  'sort': [column: string, direction: 'asc' | 'desc']
}>()

const selectedSet = computed(() => new Set(props.selectedItems?.map(item => item[props.rowKey])))

const isSelected = (row: T) => selectedSet.value.has(row[props.rowKey])

const isAllSelected = computed(() => {
  return props.data.length > 0 && props.data.every(row => selectedSet.value.has(row[props.rowKey]))
})

const toggleAll = () => {
  if (isAllSelected.value) {
    emit('update:selectedItems', [])
  } else {
    emit('update:selectedItems', [...props.data])
  }
}

const toggleRow = (row: T) => {
  const current = props.selectedItems || []
  if (isSelected(row)) {
    emit('update:selectedItems', current.filter(item => item[props.rowKey] !== row[props.rowKey]))
  } else {
    emit('update:selectedItems', [...current, row])
  }
}

const getCellValue = (row: T, column: TableColumn<T>) => {
  const value = row[column.key]
  if (column.render) {
    return column.render(value, row)
  }
  return value ?? '-'
}

const visibleActions = (row: T) => {
  return props.actions?.filter(action => !action.visible || action.visible(row)) ?? []
}
</script>

<template>
  <div class="table-container relative">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner" />
    </div>

    <table class="table">
      <thead :class="{ 'sticky top-0': stickyHeader }">
        <tr>
          <!-- Checkbox Column -->
          <th v-if="selectable" class="w-10">
            <input
              type="checkbox"
              class="form-checkbox"
              :checked="isAllSelected"
              @change="toggleAll"
            />
          </th>

          <!-- Data Columns -->
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="{
              'text-center': column.align === 'center',
              'text-right': column.align === 'right',
            }"
          >
            <span class="inline-flex items-center gap-1">
              {{ column.label }}
              <Icon
                v-if="column.sortable"
                name="lucide:arrow-up-down"
                class="w-3 h-3 text-slate-400"
              />
            </span>
          </th>

          <!-- Actions Column -->
          <th v-if="actions?.length" class="w-20 text-right">Ações</th>
        </tr>
      </thead>

      <tbody>
        <template v-if="data.length">
          <tr
            v-for="row in data"
            :key="String(row[rowKey])"
            @click="emit('row-click', row)"
          >
            <!-- Checkbox -->
            <td v-if="selectable" @click.stop>
              <input
                type="checkbox"
                class="form-checkbox"
                :checked="isSelected(row)"
                @change="toggleRow(row)"
              />
            </td>

            <!-- Data Cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="{
                'text-center': column.align === 'center',
                'text-right': column.align === 'right',
              }"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ getCellValue(row, column) }}
              </slot>
            </td>

            <!-- Actions -->
            <td v-if="actions?.length" class="text-right" @click.stop>
              <div class="flex items-center justify-end gap-1">
                <button
                  v-for="action in visibleActions(row)"
                  :key="action.key"
                  :disabled="action.disabled?.(row)"
                  class="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :title="action.label"
                  @click="action.handler(row)"
                >
                  <Icon :name="action.icon || 'lucide:more-horizontal'" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </template>

        <!-- Empty State -->
        <tr v-else>
          <td
            :colspan="columns.length + (selectable ? 1 : 0) + (actions?.length ? 1 : 0)"
            class="text-center py-12"
          >
            <div class="empty-state">
              <Icon name="lucide:inbox" class="empty-state-icon" />
              <h3 class="empty-state-title">{{ emptyTitle }}</h3>
              <p class="empty-state-description">{{ emptyDescription }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
