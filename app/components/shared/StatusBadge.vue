<script setup lang="ts">
/**
 * StatusBadge
 *
 * Badge que exibe status com configuração predefinida
 */

import type { StatusConfig, ColorVariant } from '~/types'

interface Props {
  status: string
  config?: Record<string, StatusConfig>
  fallbackLabel?: string
  fallbackColor?: ColorVariant
  showDot?: boolean
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallbackLabel: 'Desconhecido',
  fallbackColor: 'secondary',
  showDot: true,
  showIcon: false,
})

const statusInfo = computed(() => {
  if (props.config && props.config[props.status]) {
    return props.config[props.status]
  }
  return {
    label: props.fallbackLabel,
    color: props.fallbackColor,
  }
})
</script>

<template>
  <BaseBadge
    :variant="statusInfo.color"
    :dot="showDot"
    :icon="showIcon ? statusInfo.icon : undefined"
  >
    {{ statusInfo.label }}
  </BaseBadge>
</template>
