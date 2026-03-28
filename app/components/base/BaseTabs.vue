<script setup lang="ts">
/**
 * BaseTabs
 *
 * Componente de tabs reutilizável
 */

import type { TabItem } from '~/types'

interface Props {
  tabs: TabItem[]
  modelValue: string
  variant?: 'default' | 'pills' | 'underline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const variantClasses = {
  default: {
    container: 'border-b border-slate-200',
    tab: 'tab',
    active: 'tab-active',
  },
  pills: {
    container: 'bg-slate-100 p-1 rounded-lg',
    tab: 'px-4 py-2 text-sm font-medium text-slate-600 rounded-md transition-colors',
    active: 'bg-white text-slate-900 shadow-sm',
  },
  underline: {
    container: '',
    tab: 'px-4 py-2 text-sm font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-700 transition-colors',
    active: 'text-primary-600 border-primary-600',
  },
}

const config = computed(() => variantClasses[props.variant])
</script>

<template>
  <div>
    <!-- Tab Headers -->
    <div class="flex" :class="config.container">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :disabled="tab.disabled"
        class="relative"
        :class="[
          config.tab,
          activeTab === tab.key ? config.active : '',
          { 'opacity-50 cursor-not-allowed': tab.disabled },
        ]"
        @click="activeTab = tab.key"
      >
        <span class="flex items-center gap-2">
          <Icon v-if="tab.icon" :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span
            v-if="tab.badge"
            class="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
          >
            {{ tab.badge }}
          </span>
        </span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-show="activeTab === tab.key">
          <slot :name="tab.key" />
        </div>
      </template>
    </div>
  </div>
</template>
