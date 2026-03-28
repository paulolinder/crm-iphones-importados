<script setup lang="ts">
/**
 * BaseButton
 *
 * Componente base de botão reutilizável
 */

import type { ButtonVariant, Size } from '~/types'

interface Props {
  variant?: ButtonVariant
  size?: Size
  loading?: boolean
  disabled?: boolean
  block?: boolean
  icon?: string
  iconOnly?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
  iconOnly: false,
  type: 'button',
})

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
  link: 'text-primary-600 hover:text-primary-700 hover:underline p-0',
}

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'px-8 py-4 text-lg',
}
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      { 'w-full': block },
      { 'btn-icon': iconOnly },
    ]"
    :disabled="disabled || loading"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />

    <!-- Icon -->
    <Icon v-else-if="icon" :name="icon" class="w-4 h-4" />

    <!-- Content -->
    <span v-if="!iconOnly">
      <slot />
    </span>
  </button>
</template>
