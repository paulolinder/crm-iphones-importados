<script setup lang="ts">
/**
 * AppPageHeader
 *
 * Header de página com design premium
 */

import type { BreadcrumbItem, HeaderAction } from '~/types'

interface Props {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: HeaderAction[]
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  compact: false,
})

const { info: toastInfo } = useToast()

function runHeaderAction(action: HeaderAction) {
  if (action.disabled) {
    return
  }
  if (action.onClick) {
    action.onClick()
    return
  }
  toastInfo('Em breve', 'Esta ação ainda não está disponível nesta tela.')
}
</script>

<template>
  <div :class="compact ? 'mb-4' : 'mb-6 lg:mb-8'">
    <!-- Breadcrumbs -->
    <nav v-if="breadcrumbs?.length" class="mb-3">
      <ol class="flex items-center gap-1.5 text-sm">
        <li class="flex items-center gap-1.5">
          <NuxtLink
            to="/admin/dashboard"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="lucide:home" class="w-4 h-4" />
          </NuxtLink>
        </li>
        <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center gap-1.5">
          <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-300" />
          <NuxtLink
            v-if="item.to && index < breadcrumbs.length - 1"
            :to="item.to"
            class="text-slate-500 hover:text-slate-700 transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="text-slate-900 font-medium">{{ item.label }}</span>
        </li>
      </ol>
    </nav>

    <!-- Title and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-slate-900">{{ title }}</h1>
        <p v-if="description" class="text-slate-500 mt-1">{{ description }}</p>
      </div>

      <div v-if="actions?.length" class="flex flex-wrap items-center gap-2 sm:gap-3">
        <template v-for="action in actions" :key="action.key">
          <NuxtLink
            v-if="action.to"
            :to="action.to"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="[
              action.variant === 'primary'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                : '',
              action.variant === 'secondary' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : '',
              action.variant === 'outline' ? 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : '',
              action.variant === 'ghost' ? 'text-slate-600 hover:bg-slate-100' : '',
              !action.variant ? 'border border-slate-200 text-slate-700 hover:bg-slate-50' : '',
            ]"
          >
            <Icon v-if="action.icon" :name="action.icon" class="w-4 h-4" />
            {{ action.label }}
          </NuxtLink>
          <button
            v-else
            :disabled="action.disabled"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            :class="[
              action.variant === 'primary'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                : '',
              action.variant === 'secondary' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : '',
              action.variant === 'outline' ? 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : '',
              action.variant === 'ghost' ? 'text-slate-600 hover:bg-slate-100' : '',
              !action.variant ? 'border border-slate-200 text-slate-700 hover:bg-slate-50' : '',
            ]"
            @click="runHeaderAction(action)"
          >
            <Icon v-if="action.icon" :name="action.icon" class="w-4 h-4" />
            {{ action.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
