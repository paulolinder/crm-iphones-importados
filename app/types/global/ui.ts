/**
 * UI Types
 *
 * Tipos relacionados a componentes de UI
 */

/**
 * Variantes de cor
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

/**
 * Tamanhos de componente
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Variantes de botão
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link'

/**
 * Configuração de stat card (KPI)
 */
export interface StatCardConfig {
  title: string
  value: string | number
  icon?: string
  iconColor?: ColorVariant
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label?: string
  }
  footer?: string
  loading?: boolean
}

/**
 * Configuração de card de ação rápida
 */
export interface QuickActionCard {
  title: string
  description?: string
  icon: string
  iconColor?: ColorVariant
  to?: string
  onClick?: () => void
  badge?: string | number
}

/**
 * Configuração de card de informação
 */
export interface InfoCard {
  title: string
  items: {
    label: string
    value: string | number
    icon?: string
    to?: string
  }[]
}

/**
 * Configuração de gráfico simples
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string
    }[]
  }
  options?: Record<string, unknown>
}

/**
 * Configuração de timeline
 */
export interface TimelineItem {
  id: string
  title: string
  description?: string
  date: string
  icon?: string
  iconColor?: ColorVariant
  status?: 'completed' | 'current' | 'pending'
}

/**
 * Configuração de avatar
 */
export interface AvatarConfig {
  src?: string
  alt?: string
  initials?: string
  size?: Size
  status?: 'online' | 'offline' | 'away' | 'busy'
}

/**
 * Configuração de lista de atividades
 */
export interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target?: string
  date: string
  metadata?: Record<string, unknown>
}

/**
 * Toast notification config
 */
export interface ToastConfig {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Form field config
 */
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  placeholder?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  options?: { label: string; value: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

/**
 * Filter field config
 */
export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'date_range' | 'number_range' | 'checkbox'
  options?: { label: string; value: string }[]
  placeholder?: string
  defaultValue?: unknown
}

/**
 * Sidebar item config
 */
export interface SidebarItem {
  key: string
  label: string
  icon: string
  to?: string
  badge?: string | number
  badgeColor?: ColorVariant
  children?: SidebarItem[]
  dividerBefore?: boolean
  permission?: string
}

/**
 * Header action config
 */
export interface HeaderAction {
  key: string
  label: string
  icon?: string
  variant?: ButtonVariant
  onClick?: () => void
  to?: string
  disabled?: boolean
}

/**
 * Empty state config
 */
export interface EmptyStateConfig {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    to?: string
  }
}
