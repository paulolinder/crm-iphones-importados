/**
 * useToast
 *
 * Composable para gerenciar notificações toast
 */

import type { ToastConfig } from '~/types'

interface ToastItem extends ToastConfig {
  id: string
  timer?: ReturnType<typeof setTimeout>
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  const defaultDuration = 5000

  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  const add = (config: ToastConfig) => {
    const id = config.id || generateId()
    const duration = config.duration ?? defaultDuration

    const existingIndex = toasts.value.findIndex((t) => t.id === id)
    if (existingIndex !== -1) {
      remove(id)
    }

    const toast: ToastItem = {
      ...config,
      id,
      dismissible: config.dismissible ?? true,
    }

    if (duration > 0) {
      toast.timer = setTimeout(() => {
        remove(id)
      }, duration)
    }

    toasts.value.push(toast)

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      const toast = toasts.value[index]
      if (toast.timer) {
        clearTimeout(toast.timer)
      }
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value.forEach((toast) => {
      if (toast.timer) {
        clearTimeout(toast.timer)
      }
    })
    toasts.value = []
  }

  const success = (title: string, message?: string) => {
    return add({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return add({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    return add({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    return add({ type: 'info', title, message })
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  }
}
