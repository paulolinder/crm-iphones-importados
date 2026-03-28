<script setup lang="ts">
/**
 * BaseBadge
 *
 * Componente base de badge reutilizável
 */

import type { ColorVariant, Size } from '~/types'

interface Props {
  variant?: ColorVariant
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  removable?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  dot: false,
  removable: false,
})

const emit = defineEmits<{
  remove: []
}>()

const variantClasses = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-slate-100 text-slate-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  danger: 'bg-danger-100 text-danger-800',
  info: 'bg-info-100 text-info-800',
}

const dotVariantClasses = {
  primary: 'bg-primary-500',
  secondary: 'bg-slate-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}
</script>

<template>
  <span
    class="badge inline-flex items-center gap-1.5"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <!-- Dot -->
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full"
      :class="dotVariantClasses[variant]"
    />

    <!-- Icon -->
    <Icon v-if="icon" :name="icon" class="w-3.5 h-3.5" />

    <!-- Content -->
    <slot />

    <!-- Remove Button -->
    <button
      v-if="removable"
      type="button"
      class="ml-1 -mr-1 hover:opacity-70"
      @click="emit('remove')"
    >
      <Icon name="lucide:x" class="w-3 h-3" />
    </button>
  </span>
</template>
