<script setup lang="ts">
/**
 * AppCardGrid
 *
 * Grid responsivo para cards
 */

interface Props {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  cols: 4,
  gap: 'md',
})

const colClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}
</script>

<template>
  <div
    class="grid"
    :class="[colClasses[cols], gapClasses[gap]]"
  >
    <slot />
  </div>
</template>
