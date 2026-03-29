<script setup lang="ts">
/**
 * AppPageHeader
 *
 * Cabeçalho de página — hierarquia calma, ações via design system (.btn)
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

function actionButtonClass(variant?: HeaderAction['variant']) {
  const v = variant ?? 'outline'
  const map: Record<NonNullable<HeaderAction['variant']>, string> = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost',
    danger: 'btn btn-danger',
    success: 'btn btn-success',
    link: 'text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline px-2 py-1.5 rounded-md',
  }
  return map[v] ?? map.outline
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
          <span v-else class="text-slate-800 font-medium">{{ item.label }}</span>
        </li>
      </ol>
    </nav>

    <!-- Title and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">
          {{ title }}
        </h1>
        <p v-if="description" class="text-sm text-slate-500 mt-1 max-w-2xl">
          {{ description }}
        </p>
      </div>

      <div v-if="actions?.length" class="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
        <template v-for="action in actions" :key="action.key">
          <NuxtLink
            v-if="action.to"
            :to="action.to"
            :class="[actionButtonClass(action.variant), 'min-h-11']"
          >
            <Icon v-if="action.icon" :name="action.icon" class="w-4 h-4" />
            {{ action.label }}
          </NuxtLink>
          <button
            v-else
            type="button"
            :disabled="action.disabled"
            :class="[actionButtonClass(action.variant), 'min-h-11']"
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
