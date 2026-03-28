<script setup lang="ts">
/**
 * BaseSection
 *
 * Componente de seção com título e ações
 */

interface Props {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: false,
  defaultCollapsed: false,
})

const isCollapsed = ref(props.defaultCollapsed)

const toggle = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <section class="section">
    <!-- Header -->
    <div v-if="title || $slots['header-actions']" class="section-header">
      <div
        class="flex items-center gap-2"
        :class="{ 'cursor-pointer': collapsible }"
        @click="toggle"
      >
        <Icon
          v-if="collapsible"
          name="lucide:chevron-down"
          class="w-5 h-5 text-slate-400 transition-transform"
          :class="{ '-rotate-90': isCollapsed }"
        />
        <div>
          <h2 class="section-title">{{ title }}</h2>
          <p v-if="description" class="text-sm text-slate-500 mt-0.5">{{ description }}</p>
        </div>
      </div>

      <div v-if="$slots['header-actions']" class="flex items-center gap-2">
        <slot name="header-actions" />
      </div>
    </div>

    <!-- Content -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="!collapsible || !isCollapsed" class="overflow-hidden">
        <slot />
      </div>
    </Transition>
  </section>
</template>
