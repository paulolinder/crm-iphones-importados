<script setup lang="ts">
/**
 * SectionHeader
 *
 * Cabeçalho de seção com título e ações
 */

interface Props {
  title: string
  description?: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-start justify-between gap-4 mb-4">
    <div class="flex items-start gap-3">
      <div
        v-if="icon"
        class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"
      >
        <Icon :name="icon" class="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="description" class="text-sm text-slate-500 mt-0.5">{{ description }}</p>
      </div>
    </div>

    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
