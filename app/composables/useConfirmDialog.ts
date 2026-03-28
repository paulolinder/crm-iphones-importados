/**
 * useConfirmDialog
 *
 * Composable para gerenciar diálogos de confirmação
 */

import type { ConfirmDialogOptions } from '~/types'

interface ConfirmState extends ConfirmDialogOptions {
  isOpen: boolean
  isLoading: boolean
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  isOpen: false,
  isLoading: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
  resolve: null,
})

export function useConfirmDialog() {
  const isOpen = computed(() => state.isOpen)
  const isLoading = computed(() => state.isLoading)
  const options = computed(() => ({
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
  }))

  const confirm = (opts: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.title = opts.title
      state.message = opts.message
      state.confirmText = opts.confirmText ?? 'Confirmar'
      state.cancelText = opts.cancelText ?? 'Cancelar'
      state.variant = opts.variant ?? 'danger'
      state.isOpen = true
      state.resolve = resolve
    })
  }

  const handleConfirm = async () => {
    state.isLoading = true

    try {
      if (state.resolve) {
        state.resolve(true)
      }
    }
    finally {
      state.isLoading = false
      close()
    }
  }

  const handleCancel = () => {
    if (state.resolve) {
      state.resolve(false)
    }
    close()
  }

  const close = () => {
    state.isOpen = false
    state.resolve = null
  }

  return {
    isOpen,
    isLoading,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    close,
  }
}
