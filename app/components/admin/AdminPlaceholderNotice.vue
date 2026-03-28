<script setup lang="ts">
/**
 * Aviso visual para telas em integração / placeholder.
 */
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Em integração',
  description: 'Esta área está com layout pronto para conectar ao backend nas próximas etapas.',
})
</script>

<template>
  <div
    class="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-4 flex gap-3 items-start"
    role="status"
  >
    <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
      <Icon name="lucide:info" class="w-5 h-5 text-amber-700" />
    </div>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-amber-900">{{ title }}</p>
      <p class="text-sm text-amber-800/90 mt-0.5">{{ description }}</p>
    </div>
  </div>
</template>
