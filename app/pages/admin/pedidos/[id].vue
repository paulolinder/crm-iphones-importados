<script setup lang="ts">
import type { Order } from '~~/domains/vendas/types'
import type { OrderStatus, PaymentMethod } from '~/types'

definePageMeta({
  layout: 'admin',
  pageTransition: false,
})

const route = useRoute()
const { format } = useCurrency()
const { formatDateTime } = useDateFormat()
const { success, error: showError } = useToast()
const service = useOrdersService()

const orderId = computed(() => {
  const raw = route.params.id as string | string[] | undefined
  return Array.isArray(raw) ? raw[0] ?? '' : String(raw ?? '')
})

const order = ref<Order | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const actionLoading = ref(false)

const showPayModal = ref(false)
const showCancelModal = ref(false)
const payMethod = ref<PaymentMethod>('pix')
const payAmount = ref(0)
const cancelReason = ref('')

const load = async () => {
  if (!orderId.value) {
    return
  }

  loading.value = true
  loadError.value = null

  try {
    order.value = await service.getById(orderId.value)
    payAmount.value = order.value?.total ?? 0
    payMethod.value = (order.value?.payment_method ?? 'pix') as PaymentMethod
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Pedido não encontrado'
    order.value = null
  }
  finally {
    loading.value = false
  }
}

watch(orderId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() => order.value?.number ? `Pedido ${order.value.number}` : 'Pedido'),
})

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Separando',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  returned: 'Devolvido',
}

const methodLabels: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  pix: 'PIX',
  transfer: 'Transferência',
  installment: 'Parcelado',
  check: 'Cheque',
  other: 'Outro',
}

const canAdvance = computed(() => {
  const s = order.value?.status
  return s && ['pending', 'confirmed', 'processing', 'shipped'].includes(s)
})

const nextStatus = computed((): OrderStatus | null => {
  const s = order.value?.status
  if (s === 'pending') return 'confirmed'
  if (s === 'confirmed') return 'processing'
  if (s === 'processing') return 'shipped'
  if (s === 'shipped') return 'delivered'
  return null
})

const nextStatusLabels: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Confirmar pedido',
  processing: 'Iniciar separação',
  shipped: 'Marcar como enviado',
  delivered: 'Marcar como entregue',
}

const nextStatusLabel = computed(() => {
  const n = nextStatus.value
  if (!n) return ''
  return nextStatusLabels[n] ?? 'Avançar status'
})

const runUpdateStatus = async (status: OrderStatus, notes?: string) => {
  if (!order.value) return
  actionLoading.value = true
  try {
    order.value = await service.updateStatus(order.value.id, status, notes)
    success('Status atualizado', `Pedido agora está como “${statusLabels[status]}”.`)
  }
  catch (e) {
    const msg = e instanceof Error ? e.message : 'Não foi possível atualizar o status.'
    showError('Erro', msg)
  }
  finally {
    actionLoading.value = false
  }
}

const onAdvance = async () => {
  const n = nextStatus.value
  if (n) await runUpdateStatus(n)
}

const openCancel = () => {
  cancelReason.value = ''
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (!order.value) return
  await runUpdateStatus('cancelled', cancelReason.value.trim() || undefined)
  showCancelModal.value = false
}

const openPay = () => {
  if (!order.value) return
  payAmount.value = order.value.total
  payMethod.value = (order.value.payment_method ?? 'pix') as PaymentMethod
  showPayModal.value = true
}

const confirmPay = async () => {
  if (!order.value || !payMethod.value) return
  actionLoading.value = true
  try {
    await service.registerPayment(order.value.id, payAmount.value, payMethod.value)
    await load()
    success('Pagamento registrado', 'O pedido foi marcado como pago.')
    showPayModal.value = false
  }
  catch (e) {
    const msg = e instanceof Error ? e.message : 'Não foi possível registrar o pagamento.'
    showError('Erro', msg)
  }
  finally {
    actionLoading.value = false
  }
}

const showPaymentPending = computed(() => order.value?.payment_status === 'pending')
const canCancel = computed(() => order.value && !['cancelled', 'delivered', 'returned'].includes(order.value.status))

const headerActions = computed(() => {
  const actions: { key: string; label: string; icon?: string; variant?: 'primary' | 'outline'; to?: string }[] = []
  if (order.value) {
    actions.push({
      key: 'edit',
      label: 'Editar',
      icon: 'lucide:pencil',
      variant: 'outline',
      to: `/admin/vendas/${order.value.id}/editar`,
    })
  }
  actions.push({ key: 'list', label: 'Lista de pedidos', variant: 'outline', to: '/admin/pedidos' })
  return actions
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Pedido"
      :description="order ? `${order.number} · ${order.customer?.name || 'Cliente'}` : 'Carregando…'"
      :breadcrumbs="[
        { label: 'Pedidos', to: '/admin/pedidos' },
        { label: order?.number || 'Detalhes' },
      ]"
      :actions="headerActions"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando pedido…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
      <div class="mt-3">
        <NuxtLink to="/admin/pedidos" class="text-blue-700 font-medium hover:underline">
          Voltar aos pedidos
        </NuxtLink>
      </div>
    </div>

    <template v-else-if="order">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-if="canAdvance && nextStatus"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            :disabled="actionLoading"
            @click="onAdvance"
          >
            <Icon name="lucide:arrow-right-circle" class="w-4 h-4" />
            {{ nextStatusLabel }}
          </button>
          <button
            v-if="showPaymentPending"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            :disabled="actionLoading"
            @click="openPay"
          >
            <Icon name="lucide:circle-dollar-sign" class="w-4 h-4" />
            Registrar pagamento
          </button>
          <button
            v-if="canCancel"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
            :disabled="actionLoading"
            @click="openCancel"
          >
            <Icon name="lucide:x-circle" class="w-4 h-4" />
            Cancelar pedido
          </button>
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="px-3 py-1 rounded-full bg-slate-100 font-medium capitalize">
            {{ statusLabels[order.status] }}
          </span>
          <span
            class="px-3 py-1 rounded-full font-medium"
            :class="order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'"
          >
            {{ order.payment_status === 'paid' ? 'Pago' : order.payment_status === 'pending' ? 'Pagamento pendente' : order.payment_status }}
          </span>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ format(order.total) }}
          </p>
          <p class="text-xs text-slate-500 mt-2">
            Subtotal {{ format(order.subtotal) }}
            <span v-if="order.shipping"> · Frete {{ format(order.shipping) }}</span>
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Cliente
          </p>
          <NuxtLink
            v-if="order.customer_id"
            :to="`/admin/clientes/${order.customer_id}`"
            class="mt-2 block text-sm font-semibold text-blue-700 hover:underline"
          >
            {{ order.customer?.name || 'Ver cliente' }}
          </NuxtLink>
          <p v-else class="mt-2 text-sm font-medium text-slate-900">
            {{ order.customer?.name || '—' }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            {{ order.customer?.email || order.customer?.phone || '' }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Datas
          </p>
          <ul class="mt-2 space-y-1 text-xs text-slate-600">
            <li>
              Criado: {{ formatDateTime(order.created_at) }}
            </li>
            <li v-if="order.shipped_at">
              Enviado: {{ formatDateTime(order.shipped_at) }}
            </li>
            <li v-if="order.delivered_at">
              Entregue: {{ formatDateTime(order.delivered_at) }}
            </li>
            <li v-if="order.cancelled_at">
              Cancelado: {{ formatDateTime(order.cancelled_at) }}
            </li>
          </ul>
          <p v-if="order.seller?.name" class="text-xs text-slate-500 mt-2">
            Vendedor: {{ order.seller.name }}
          </p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-900">
            Itens
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[480px]">
            <thead class="bg-slate-50/80 text-left text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th class="px-6 py-3">
                  Produto
                </th>
                <th class="px-6 py-3 text-right">
                  Qtd
                </th>
                <th class="px-6 py-3 text-right">
                  Unit.
                </th>
                <th class="px-6 py-3 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in order.items" :key="item.id">
                <td class="px-6 py-3">
                  <span class="font-medium text-slate-900">{{ item.product_name }}</span>
                  <span v-if="item.sku" class="block text-xs text-slate-400">SKU {{ item.sku }}</span>
                </td>
                <td class="px-6 py-3 text-right">
                  {{ item.quantity }}
                </td>
                <td class="px-6 py-3 text-right">
                  {{ format(item.unit_price) }}
                </td>
                <td class="px-6 py-3 text-right font-medium">
                  {{ format(item.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="order.payments?.length" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-900">
            Pagamentos
          </h3>
        </div>
        <ul class="divide-y divide-slate-50">
          <li
            v-for="p in order.payments"
            :key="p.id"
            class="px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
          >
            <span class="text-slate-700">{{ methodLabels[p.method] }}</span>
            <span class="font-semibold text-slate-900">{{ format(p.amount) }}</span>
            <span class="text-xs text-slate-500 w-full sm:w-auto">
              {{ p.paid_at ? formatDateTime(p.paid_at) : 'Pendente' }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="order.cancellation_reason" class="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4">
        <h3 class="text-sm font-semibold text-red-900">
          Motivo do cancelamento
        </h3>
        <p class="text-sm text-red-800 mt-1 whitespace-pre-wrap">
          {{ order.cancellation_reason }}
        </p>
      </div>

      <div v-if="order.notes" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">
          Observações
        </h3>
        <p class="text-sm text-slate-600 whitespace-pre-wrap">
          {{ order.notes }}
        </p>
      </div>
    </template>

    <BaseModal v-model="showPayModal" title="Registrar pagamento" size="md">
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Confirme o valor e o método. O pedido será marcado como pago no sistema.
        </p>
        <div>
          <label class="form-label">Valor</label>
          <input v-model.number="payAmount" type="number" min="0" step="0.01" class="form-input">
        </div>
        <div>
          <label class="form-label">Método</label>
          <select v-model="payMethod" class="form-input">
            <option value="pix">
              PIX
            </option>
            <option value="cash">
              Dinheiro
            </option>
            <option value="credit_card">
              Cartão de crédito
            </option>
            <option value="debit_card">
              Cartão de débito
            </option>
            <option value="transfer">
              Transferência
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-outline" @click="showPayModal = false">
            Voltar
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="actionLoading || payAmount <= 0"
            @click="confirmPay"
          >
            {{ actionLoading ? 'Salvando…' : 'Confirmar pagamento' }}
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="showCancelModal" title="Cancelar pedido" size="md">
      <div class="space-y-4">
        <p class="text-sm text-slate-600">
          Informe um motivo (opcional). Ele ficará registrado no pedido.
        </p>
        <div>
          <label class="form-label">Motivo</label>
          <textarea v-model="cancelReason" class="form-input min-h-24" placeholder="Ex.: cliente desistiu, erro no estoque…" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-outline" @click="showCancelModal = false">
            Voltar
          </button>
          <button
            type="button"
            class="btn-primary bg-red-600 hover:bg-red-700 border-0"
            :disabled="actionLoading"
            @click="confirmCancel"
          >
            {{ actionLoading ? 'Cancelando…' : 'Confirmar cancelamento' }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>