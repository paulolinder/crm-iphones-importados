<script setup lang="ts">
/**
 * ErrorState
 *
 * Componente de estado de erro
 */

interface Props {
  title?: string
  message?: string
  retryLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Ocorreu um erro',
  message: 'Não foi possível carregar os dados. Tente novamente.',
  retryLabel: 'Tentar novamente',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mb-4">
      <Icon name="lucide:alert-circle" class="w-8 h-8 text-danger-600" />
    </div>

    <h3 class="text-lg font-medium text-slate-900 mb-1">{{ title }}</h3>
    <p class="text-sm text-slate-500 mb-4 max-w-sm">{{ message }}</p>

    <button class="btn-outline" @click="emit('retry')">
      <Icon name="lucide:refresh-cw" class="w-4 h-4" />
      {{ retryLabel }}
    </button>
  </div>
</template>
