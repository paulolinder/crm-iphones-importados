/**
 * useDateFormat
 *
 * Composable para formatação de datas
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DateFormatOptions {
  locale?: Locale
}

export function useDateFormat(options: DateFormatOptions = {}) {
  const locale = options.locale || ptBR

  const parseDate = (value: string | Date | null | undefined): Date | null => {
    if (!value) return null

    const date = typeof value === 'string' ? parseISO(value) : value

    return isValid(date) ? date : null
  }

  const formatDate = (
    value: string | Date | null | undefined,
    formatStr: string = 'dd/MM/yyyy'
  ): string => {
    const date = parseDate(value)
    if (!date) return '-'

    return format(date, formatStr, { locale })
  }

  const formatDateTime = (
    value: string | Date | null | undefined,
    formatStr: string = 'dd/MM/yyyy HH:mm'
  ): string => {
    return formatDate(value, formatStr)
  }

  const formatTime = (
    value: string | Date | null | undefined,
    formatStr: string = 'HH:mm'
  ): string => {
    return formatDate(value, formatStr)
  }

  const formatLongDate = (value: string | Date | null | undefined): string => {
    return formatDate(value, "dd 'de' MMMM 'de' yyyy")
  }

  const formatRelative = (value: string | Date | null | undefined): string => {
    const date = parseDate(value)
    if (!date) return '-'

    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  const formatShort = (value: string | Date | null | undefined): string => {
    const date = parseDate(value)
    if (!date) return '-'

    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) {
      return `Hoje às ${format(date, 'HH:mm', { locale })}`
    }

    if (diffDays === 1) {
      return `Ontem às ${format(date, 'HH:mm', { locale })}`
    }

    if (diffDays < 7) {
      return format(date, "EEEE 'às' HH:mm", { locale })
    }

    return format(date, 'dd/MM/yyyy', { locale })
  }

  return {
    parseDate,
    formatDate,
    formatDateTime,
    formatTime,
    formatLongDate,
    formatRelative,
    formatShort,
  }
}
