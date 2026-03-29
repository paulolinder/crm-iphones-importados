import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/lib/supabase/types'

type UserClient = SupabaseClient<Database>

export interface CommercialOrderPdfPayload {
  storeName: string
  orderNumber: string
  createdAtIso: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  statusLabel: string
  paymentStatusLabel: string
  paymentMethodLabel: string | null
  sellerName: string | null
  items: {
    product_name: string
    sku: string | null
    quantity: number
    unit_price: number
    discount_amount: number
    total_amount: number
  }[]
  subtotal: number
  discount_amount: number
  shipping_amount: number
  total_amount: number
  notes: string | null
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Em separação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  returned: 'Devolvido',
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  partial: 'Parcial',
  refunded: 'Reembolsado',
  failed: 'Falhou',
  cancelled: 'Cancelado',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Dinheiro',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  pix: 'PIX',
  transfer: 'Transferência',
  installment: 'Parcelado',
  check: 'Cheque',
  other: 'Outro',
}

export async function fetchOrderCommercialPdfPayload(
  userClient: UserClient,
  orderId: string,
  storeName: string,
): Promise<CommercialOrderPdfPayload | null> {
  const { data: order, error: orderErr } = await userClient
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (orderErr || !order) {
    return null
  }

  const [{ data: customer }, { data: seller }, { data: items }] = await Promise.all([
    userClient.from('customers').select('id, name, email, phone').eq('id', order.customer_id).maybeSingle(),
    order.seller_id
      ? userClient.from('profiles').select('id, full_name, email').eq('id', order.seller_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    userClient.from('order_items').select('*').eq('order_id', order.id),
  ])

  const pm = order.payment_method
  const paymentMethodLabel = pm ? (PAYMENT_METHOD_LABELS[pm] ?? pm) : null

  return {
    storeName,
    orderNumber: order.order_number,
    createdAtIso: order.created_at,
    customerName: customer?.name ?? '—',
    customerPhone: customer?.phone ?? null,
    customerEmail: customer?.email ?? null,
    statusLabel: STATUS_LABELS[order.status] ?? order.status,
    paymentStatusLabel: PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status,
    paymentMethodLabel,
    sellerName: seller?.full_name ?? seller?.email ?? null,
    items: items ?? [],
    subtotal: order.subtotal,
    discount_amount: order.discount_amount,
    shipping_amount: order.shipping_amount,
    total_amount: order.total_amount,
    notes: order.notes,
  }
}
