<script setup lang="ts">
/**
 * AppContainer
 *
 * Container padrão para conteúdo de página
 */

interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  maxWidth: '7xl',
  padding: true,
})

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}
</script>

<template>
  <div
    class="mx-auto"
    :class="[
      maxWidthClasses[maxWidth],
      padding ? 'p-6' : '',
    ]"
  >
    <slot />
  </div>
</template>
