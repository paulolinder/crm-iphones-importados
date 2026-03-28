/**
 * Global Type Definitions
 *
 * Este arquivo contém tipos globais usados em toda a aplicação.
 */

/**
 * Tipo base para entidades com ID
 */
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    per_page: number
    total_pages: number
    has_more: boolean
  }
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number
  per_page?: number
  order_by?: string
  order_direction?: 'asc' | 'desc'
}

/**
 * Parâmetros de filtro genérico
 */
export interface FilterParams {
  search?: string
  status?: string
  date_from?: string
  date_to?: string
  [key: string]: unknown
}

/**
 * Resposta de API padrão
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * Resposta de lista
 */
export interface ListResponse<T> {
  items: T[]
  total: number
}

/**
 * Estado de operação assíncrona
 */
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Opção de select/dropdown
 */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  icon?: string
  description?: string
}

/**
 * Configuração de coluna de tabela
 */
export interface TableColumn<T = unknown> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T) => string
}

/**
 * Ação de tabela
 */
export interface TableAction<T = unknown> {
  key: string
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger'
  handler: (row: T) => void
  visible?: (row: T) => boolean
  disabled?: (row: T) => boolean
}

/**
 * Configuração de breadcrumb
 */
export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

/**
 * Tab configuration
 */
export interface TabItem {
  key: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

/**
 * Menu item
 */
export interface MenuItem {
  key: string
  label: string
  icon?: string
  to?: string
  children?: MenuItem[]
  badge?: string | number
  disabled?: boolean
  divider?: boolean
}

/**
 * Notification
 */
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

/**
 * Confirm dialog options
 */
export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

/**
 * Address structure
 */
export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  country?: string
}

/**
 * Contact info
 */
export interface ContactInfo {
  phone?: string
  mobile?: string
  whatsapp?: string
  email?: string
}

/**
 * Audit info
 */
export interface AuditInfo {
  created_by?: string
  created_at: string
  updated_by?: string
  updated_at: string
}
