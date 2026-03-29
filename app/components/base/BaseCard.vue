<script setup lang="ts">
/**
 * BaseCard
 *
 * Componente base de card reutilizável
 */

interface Props {
  title?: string
  description?: string
  padding?: boolean
  hover?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
  clickable: false,
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="card"
    :class="{
      'card-hover cursor-pointer': hover || clickable,
    }"
    @click="clickable ? emit('click') : undefined"
  >
    <!-- Header -->
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-slate-900 tracking-tight">{{ title }}</h3>
            <p v-if="description" class="text-sm text-slate-500 mt-0.5">{{ description }}</p>
          </div>
          <slot name="header-actions" />
        </div>
      </slot>
    </div>

    <!-- Body -->
    <div :class="{ 'card-body': padding, 'p-0': !padding }">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
