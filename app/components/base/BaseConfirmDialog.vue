<script setup lang="ts">
/**
 * BaseConfirmDialog
 *
 * Dialog de confirmação reutilizável
 */

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar ação',
  message: 'Tem certeza que deseja realizar esta ação?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const close = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  close()
  emit('cancel')
}

const variantConfig = {
  danger: {
    icon: 'lucide:alert-triangle',
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-600',
    buttonClass: 'btn-danger',
  },
  warning: {
    icon: 'lucide:alert-circle',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    buttonClass: 'bg-warning-600 hover:bg-warning-700 text-white',
  },
  info: {
    icon: 'lucide:info',
    iconBg: 'bg-info-100',
    iconColor: 'text-info-600',
    buttonClass: 'btn-primary',
  },
}

const config = computed(() => variantConfig[props.variant])
</script>

<template>
  <BaseModal
    v-model="isOpen"
    size="sm"
    :closable="!loading"
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <div class="text-center sm:text-left">
      <!-- Icon -->
      <div
        class="mx-auto sm:mx-0 flex items-center justify-center w-12 h-12 rounded-full"
        :class="config.iconBg"
      >
        <Icon :name="config.icon" class="w-6 h-6" :class="config.iconColor" />
      </div>

      <!-- Content -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton
          variant="outline"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </BaseButton>
        <BaseButton
          :class="config.buttonClass"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
