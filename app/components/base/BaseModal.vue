<script setup lang="ts">
/**
 * BaseModal
 *
 * Componente base de modal reutilizável
 */

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  closeOnEsc: true,
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const close = () => {
  if (!props.persistent) {
    isOpen.value = false
    emit('close')
  }
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnEsc) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-h-[min(90vh,800px)] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
            :class="sizeClasses[size]"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="title || closable || $slots.header"
              class="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100 shrink-0"
            >
              <slot name="header">
                <h3 class="text-lg font-semibold text-slate-900 pr-2">
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="closable"
                type="button"
                class="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors shrink-0"
                aria-label="Fechar"
                @click="close"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-5 py-4 overflow-y-auto min-h-0">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-5 py-4 border-t border-slate-100 shrink-0">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
