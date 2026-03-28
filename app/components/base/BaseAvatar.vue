<script setup lang="ts">
/**
 * BaseAvatar
 *
 * Componente de avatar reutilizável
 */

import type { Size } from '~/types'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: Size
  status?: 'online' | 'offline' | 'away' | 'busy'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const initials = computed(() => {
  if (!props.name) return '?'
  const names = props.name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
})

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const statusClasses = {
  online: 'bg-success-500',
  offline: 'bg-slate-400',
  away: 'bg-warning-500',
  busy: 'bg-danger-500',
}

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}
</script>

<template>
  <div class="relative inline-flex">
    <!-- Image Avatar -->
    <img
      v-if="src"
      :src="src"
      :alt="alt || name"
      class="rounded-full object-cover"
      :class="sizeClasses[size]"
    />

    <!-- Initials Avatar -->
    <div
      v-else
      class="avatar"
      :class="sizeClasses[size]"
    >
      {{ initials }}
    </div>

    <!-- Status Indicator -->
    <span
      v-if="status"
      class="absolute bottom-0 right-0 block rounded-full ring-2 ring-white"
      :class="[statusClasses[status], statusSizeClasses[size]]"
    />
  </div>
</template>
