/**
 * Status Types
 *
 * Define os tipos de status usados no sistema
 */

/**
 * Status genérico de ativo/inativo
 */
export type ActiveStatus = 'active' | 'inactive'

/**
 * Status de pedido/venda
 */
export type OrderStatus =
  | 'draft'        // Rascunho
  | 'pending'      // Aguardando
  | 'confirmed'    // Confirmado
  | 'processing'   // Em processamento
  | 'shipped'      // Enviado
  | 'delivered'    // Entregue
  | 'cancelled'    // Cancelado
  | 'returned'     // Devolvido

/**
 * Status de pagamento
 */
export type PaymentStatus =
  | 'pending'     // Pendente
  | 'paid'        // Pago
  | 'partial'     // Parcial
  | 'refunded'    // Reembolsado
  | 'failed'      // Falhou
  | 'cancelled'   // Cancelado

/**
 * Método de pagamento
 */
export type PaymentMethod =
  | 'cash'          // Dinheiro
  | 'credit_card'   // Cartão de crédito
  | 'debit_card'    // Cartão de débito
  | 'pix'           // PIX
  | 'transfer'      // Transferência
  | 'installment'   // Parcelado
  | 'check'         // Cheque
  | 'other'         // Outro

/**
 * Status de estoque
 */
export type StockStatus =
  | 'in_stock'     // Em estoque
  | 'low_stock'    // Estoque baixo
  | 'out_of_stock' // Sem estoque
  | 'reserved'     // Reservado

/**
 * Status de garantia
 */
export type WarrantyStatus =
  | 'valid'       // Válida
  | 'expiring'    // Próxima de expirar
  | 'expired'     // Expirada
  | 'claimed'     // Acionada
  | 'void'        // Anulada

/**
 * Status de assistência técnica
 */
export type ServiceStatus =
  | 'pending'       // Aguardando
  | 'diagnosing'    // Diagnosticando
  | 'waiting_parts' // Aguardando peças
  | 'in_repair'     // Em reparo
  | 'ready'         // Pronto
  | 'delivered'     // Entregue
  | 'cancelled'     // Cancelado

/**
 * Tipo de documento
 */
export type DocumentType = 'cpf' | 'cnpj' | 'rg' | 'passport' | 'other'

/**
 * Papel do usuário
 */
export type UserRole =
  | 'admin'       // Administrador
  | 'manager'     // Gerente
  | 'seller'      // Vendedor
  | 'support'     // Suporte
  | 'technician'  // Técnico
  | 'viewer'      // Visualizador

/**
 * Configuração de badge para status
 */
export interface StatusConfig {
  label: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
}

/**
 * Mapas de configuração de status
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  draft: { label: 'Rascunho', color: 'secondary', icon: 'lucide:file-text' },
  pending: { label: 'Pendente', color: 'warning', icon: 'lucide:clock' },
  confirmed: { label: 'Confirmado', color: 'info', icon: 'lucide:check' },
  processing: { label: 'Processando', color: 'primary', icon: 'lucide:loader' },
  shipped: { label: 'Enviado', color: 'info', icon: 'lucide:truck' },
  delivered: { label: 'Entregue', color: 'success', icon: 'lucide:check-circle' },
  cancelled: { label: 'Cancelado', color: 'danger', icon: 'lucide:x-circle' },
  returned: { label: 'Devolvido', color: 'secondary', icon: 'lucide:undo' },
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  pending: { label: 'Pendente', color: 'warning', icon: 'lucide:clock' },
  paid: { label: 'Pago', color: 'success', icon: 'lucide:check-circle' },
  partial: { label: 'Parcial', color: 'info', icon: 'lucide:percent' },
  refunded: { label: 'Reembolsado', color: 'secondary', icon: 'lucide:undo' },
  failed: { label: 'Falhou', color: 'danger', icon: 'lucide:x-circle' },
  cancelled: { label: 'Cancelado', color: 'danger', icon: 'lucide:x' },
}

export const STOCK_STATUS_CONFIG: Record<StockStatus, StatusConfig> = {
  in_stock: { label: 'Em estoque', color: 'success', icon: 'lucide:check' },
  low_stock: { label: 'Estoque baixo', color: 'warning', icon: 'lucide:alert-triangle' },
  out_of_stock: { label: 'Sem estoque', color: 'danger', icon: 'lucide:x' },
  reserved: { label: 'Reservado', color: 'info', icon: 'lucide:lock' },
}

export const WARRANTY_STATUS_CONFIG: Record<WarrantyStatus, StatusConfig> = {
  valid: { label: 'Válida', color: 'success', icon: 'lucide:shield-check' },
  expiring: { label: 'Expirando', color: 'warning', icon: 'lucide:alert-triangle' },
  expired: { label: 'Expirada', color: 'danger', icon: 'lucide:shield-x' },
  claimed: { label: 'Acionada', color: 'info', icon: 'lucide:shield' },
  void: { label: 'Anulada', color: 'secondary', icon: 'lucide:shield-off' },
}

export const SERVICE_STATUS_CONFIG: Record<ServiceStatus, StatusConfig> = {
  pending: { label: 'Aguardando', color: 'warning', icon: 'lucide:clock' },
  diagnosing: { label: 'Diagnosticando', color: 'info', icon: 'lucide:search' },
  waiting_parts: { label: 'Aguardando peças', color: 'warning', icon: 'lucide:package' },
  in_repair: { label: 'Em reparo', color: 'primary', icon: 'lucide:wrench' },
  ready: { label: 'Pronto', color: 'success', icon: 'lucide:check-circle' },
  delivered: { label: 'Entregue', color: 'success', icon: 'lucide:check' },
  cancelled: { label: 'Cancelado', color: 'danger', icon: 'lucide:x-circle' },
}
