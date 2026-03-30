/**
 * Links WhatsApp da landing (número só dígitos, com DDI, ex.: 5565999999999).
 */
export function useLandingWhatsapp() {
  const config = useRuntimeConfig()

  const digits = computed(() => {
    const raw = String(config.public.whatsappPhone ?? '').replace(/\D/g, '')
    return raw
  })

  const isConfigured = computed(() => digits.value.length >= 10)

  const defaultMessage = computed(
    () =>
      String(config.public.whatsappDefaultMessage ?? '')
        || 'Olá! Vim pelo site da Eleve Imports e gostaria de uma cotação.',
  )

  function whatsappUrl(customText?: string): string {
    if (!isConfigured.value) {
      return '#contato'
    }
    const text = customText ?? defaultMessage.value
    const q = text ? `?text=${encodeURIComponent(text)}` : ''
    return `https://wa.me/${digits.value}${q}`
  }

  return {
    digits,
    isConfigured,
    defaultMessage,
    whatsappUrl,
  }
}
