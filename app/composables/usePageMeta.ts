/**
 * usePageMeta
 *
 * Composable para gerenciar metadados de página
 */

import type { BreadcrumbItem, HeaderAction } from '~/types'

interface PageMetaOptions {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: HeaderAction[]
}

export function usePageMeta(options: PageMetaOptions) {
  const { title, description, breadcrumbs, actions } = options

  useHead({
    title,
    meta: description
      ? [{ name: 'description', content: description }]
      : undefined,
  })

  return {
    title,
    description,
    breadcrumbs: breadcrumbs ?? [],
    actions: actions ?? [],
  }
}
