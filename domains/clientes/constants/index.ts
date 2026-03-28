/**
 * Clientes Constants
 *
 * Constantes do módulo de clientes
 */

export const CUSTOMER_DOCUMENT_TYPES = [
  { label: 'CPF', value: 'cpf' },
  { label: 'CNPJ', value: 'cnpj' },
] as const

export const CUSTOMER_GENDERS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
] as const

export const CUSTOMER_STATUS_OPTIONS = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' },
] as const

export const CUSTOMER_TABLE_COLUMNS = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'total_orders', label: 'Pedidos', align: 'center' as const },
  { key: 'total_spent', label: 'Total Gasto', align: 'right' as const },
  { key: 'created_at', label: 'Cadastro', sortable: true },
]
