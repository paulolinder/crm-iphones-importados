<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    /** Primário verde, outline, flutuante fixo, ou claro sobre fundo escuro */
    variant?: 'primary' | 'outline' | 'float' | 'inverted'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    label: 'Falar no WhatsApp',
    variant: 'primary',
    size: 'md',
  },
)

const { whatsappUrl, isConfigured } = useLandingWhatsapp()

function scrollToContato(e: MouseEvent) {
  if (isConfigured.value) {
    return
  }
  e.preventDefault()
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
}

const href = computed(() => whatsappUrl())

const sizeClass = computed(() => {
  if (props.variant === 'float') {
    return 'h-14 w-14 min-h-14 min-w-14 p-0 items-center justify-center shadow-lg shadow-emerald-900/10'
  }
  const map = {
    sm: 'px-3.5 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  }
  return map[props.size]
})

const variantClass = computed(() => {
  if (props.variant === 'float') {
    return 'bg-[#25D366] text-white hover:bg-[#20bd5a] rounded-full'
  }
  if (props.variant === 'outline') {
    return 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 rounded-full'
  }
  if (props.variant === 'inverted') {
    return 'bg-white text-[#0c0c0d] hover:bg-zinc-100 rounded-full'
  }
  return 'bg-[#25D366] text-white hover:bg-[#20bd5a] rounded-full'
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    :class="[sizeClass, variantClass, variant === 'float' ? 'fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8' : '']"
    :aria-label="label"
    @click="scrollToContato"
  >
    <Icon
      name="lucide:message-circle"
      class="shrink-0"
      :class="variant === 'float' ? 'h-7 w-7' : 'h-[1.15em] w-[1.15em]'"
    />
    <span v-if="variant !== 'float'" class="whitespace-nowrap">{{ label }}</span>
  </a>
</template>
