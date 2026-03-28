<script setup lang="ts">
/**
 * BaseEmptyState
 *
 * Componente para estados vazios
 */

interface Props {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:inbox',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <Icon :name="icon" class="empty-state-icon" />
    <h3 class="empty-state-title">{{ title }}</h3>
    <p v-if="description" class="empty-state-description">{{ description }}</p>

    <NuxtLink
      v-if="actionTo"
      :to="actionTo"
      class="btn-primary mt-4"
    >
      {{ actionLabel }}
    </NuxtLink>

    <button
      v-else-if="actionLabel"
      class="btn-primary mt-4"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
