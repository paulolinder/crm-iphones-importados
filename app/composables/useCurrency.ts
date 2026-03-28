/**
 * useCurrency
 *
 * Composable para formatação de moeda
 */

interface CurrencyOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const defaultOptions: CurrencyOptions = {
  locale: 'pt-BR',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

export function useCurrency(options: CurrencyOptions = {}) {
  const config = { ...defaultOptions, ...options }

  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  })

  const format = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '-'

    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue)) return '-'

    return formatter.format(numValue)
  }

  const parse = (value: string): number => {
    const cleanValue = value
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.')

    return parseFloat(cleanValue) || 0
  }

  const formatCompact = (value: number): string => {
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `R$ ${(value / 1_000).toFixed(1)}K`
    }
    return format(value)
  }

  return {
    format,
    parse,
    formatCompact,
  }
}
