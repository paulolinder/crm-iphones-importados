<script setup lang="ts">
/**
 * Grid responsivo para campos de formulário placeholder.
 */
interface Props {
  columns?: 1 | 2
}

withDefaults(defineProps<Props>(), {
  columns: 2,
})
</script>

<template>
  <div
    class="grid gap-4"
    :class="columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'"
  >
    <slot />
  </div>
</template>
