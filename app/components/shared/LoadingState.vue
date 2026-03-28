<script setup lang="ts">
/**
 * LoadingState
 *
 * Componente de estado de carregamento
 */

interface Props {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  text: 'Carregando...',
  size: 'md',
  overlay: false,
})

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-3',
  lg: 'w-16 h-16 border-4',
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3"
    :class="{ 'absolute inset-0 bg-white/80 z-10': overlay }"
  >
    <div
      class="border-slate-200 border-t-primary-600 rounded-full animate-spin"
      :class="sizeClasses[size]"
    />
    <p v-if="text" class="text-sm text-slate-500">{{ text }}</p>
  </div>
</template>
