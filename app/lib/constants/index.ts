/**
 * Global Constants
 *
 * Constantes globais do sistema
 */

/**
 * Configurações de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50, 100],
  MAX_PER_PAGE: 100,
} as const

/**
 * Configurações de upload
 */
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

/**
 * Configurações de moeda
 */
export const CURRENCY = {
  CODE: 'BRL',
  LOCALE: 'pt-BR',
  SYMBOL: 'R$',
} as const

/**
 * Configurações de data
 */
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: "dd 'de' MMMM 'de' yyyy",
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

/**
 * Estados brasileiros
 */
export const BRAZILIAN_STATES = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
] as const

/**
 * Métodos de pagamento
 */
export const PAYMENT_METHODS = [
  { label: 'Dinheiro', value: 'cash', icon: 'lucide:banknote' },
  { label: 'Cartão de Crédito', value: 'credit_card', icon: 'lucide:credit-card' },
  { label: 'Cartão de Débito', value: 'debit_card', icon: 'lucide:credit-card' },
  { label: 'PIX', value: 'pix', icon: 'lucide:qr-code' },
  { label: 'Transferência', value: 'transfer', icon: 'lucide:send' },
  { label: 'Parcelado', value: 'installment', icon: 'lucide:calendar' },
] as const

/**
 * Roles de usuário
 */
export const USER_ROLES = [
  { label: 'Administrador', value: 'admin', description: 'Acesso total ao sistema' },
  { label: 'Gerente', value: 'manager', description: 'Gerencia equipe e relatórios' },
  { label: 'Vendedor', value: 'seller', description: 'Realiza vendas e atendimento' },
  { label: 'Suporte', value: 'support', description: 'Assistência técnica e garantias' },
  { label: 'Técnico', value: 'technician', description: 'Reparos e manutenção' },
] as const

/**
 * Cores para gráficos
 */
export const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
] as const

/**
 * Meses do ano
 */
export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

/**
 * Dias da semana
 */
export const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const

/**
 * Dias da semana abreviados
 */
export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const
