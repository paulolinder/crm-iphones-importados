<script setup lang="ts">
import type { Order } from '~~/domains/vendas/types'
import type { OrderStatus, PaymentMethod } from '~/types'
import { ORDER_STATUS_CONFIG } from '~/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const orderId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const { format } = useCurrency()
const service = useOrdersService()
const { success, error: toastError } = useToast()

const order = ref<Order | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const saving = ref(false)
const paySaving = ref(false)

const statusForm = reactive({
  status: 'pending' as OrderStatus,
  notes: '',
})

const payForm = reactive({
  amount: 0,
  method: 'pix' as PaymentMethod,
})

const load = async () => {
  if (!orderId.value) {
    return
  }

  loading.value = true
  loadError.value = null

  try {
    order.value = await service.getById(orderId.value)
    if (order.value) {
      statusForm.status = order.value.status
      statusForm.notes = ''
      payForm.amount = order.value.payment_status === 'paid' ? 0 : order.value.total
      payForm.method = (order.value.payment_method as PaymentMethod) || 'pix'
    }
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

useHead({ title: 'Editar pedido' })

const breadcrumbs = computed(() => [
  { label: 'Vendas', to: '/admin/vendas' },
  { label: order.value?.number || 'Pedido', to: `/admin/vendas/${orderId.value}` },
  { label: 'Editar' },
])

const statusOptions = computed(() =>
  (Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[]).map(s => ({
    value: s,
    label: ORDER_STATUS_CONFIG[s].label,
  })),
)

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Dinheiro' },
  { value: 'credit_card', label: 'Cartão crédito' },
  { value: 'debit_card', label: 'Cartão débito' },
  { value: 'pix', label: 'PIX' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'installment', label: 'Parcelado' },
  { value: 'check', label: 'Cheque' },
  { value: 'other', label: 'Outro' },
]

const applyStatus = async () => {
  if (!order.value) {
    return
  }
  saving.value = true
  try {
    await service.updateStatus(orderId.value, statusForm.status, statusForm.notes.trim() || undefined)
    success('Status atualizado', '')
    await load()
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao atualizar status')
  }
  finally {
    saving.value = false
  }
}

const markPaid = async () => {
  if (!order.value) {
    return
  }
  if (order.value.payment_status === 'paid') {
    toastError('Pedido', 'Já consta como pago.')
    return
  }
  if (!payForm.amount || payForm.amount <= 0) {
    toastError('Validação', 'Informe o valor do pagamento.')
    return
  }
  paySaving.value = true
  try {
    await service.registerPayment(orderId.value, payForm.amount, payForm.method)
    success('Pagamento registrado', '')
    await load()
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao registrar pagamento')
  }
  finally {
    paySaving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar pedido"
      :description="order?.number || 'Carregando…'"
      :breadcrumbs="breadcrumbs"
      :actions="[
        { key: 'view', label: 'Ver detalhes', variant: 'outline', to: `/admin/vendas/${orderId}` },
        { key: 'back', label: 'Lista', variant: 'ghost', to: '/admin/vendas' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
    </div>
    <template v-else-if="order">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-slate-500">
              Status do pedido
            </p>
            <p class="font-medium capitalize">
              {{ order.status }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">
              Pagamento
            </p>
            <p class="font-medium capitalize">
              {{ order.payment_status }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">
              Frete
            </p>
            <p>{{ format(order.shipping) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500">
              Desconto
            </p>
            <p>{{ format(order.discount) }}</p>
          </div>
        </div>
        <p class="text-xs text-slate-500">
          Total: <span class="font-semibold text-slate-800">{{ format(order.total) }}</span>
        </p>

        <div class="border-t border-slate-100 pt-6 space-y-3">
          <h3 class="text-sm font-semibold text-slate-900">
            Alterar status
          </h3>
          <div class="flex flex-wrap gap-3 items-end">
            <div class="flex-1 min-w-[180px]">
              <label class="form-label">Novo status</label>
              <select v-model="statusForm.status" class="form-input">
                <option v-for="o in statusOptions" :key="o.value" :value="o.value">
                  {{ o.label }}
                </option>
              </select>
            </div>
            <div class="flex-1 min-w-[200px]">
              <label class="form-label">Observação (cancelamento, etc.)</label>
              <input v-model="statusForm.notes" type="text" class="form-input">
            </div>
            <button type="button" class="btn-primary" :disabled="saving" @click="applyStatus">
              {{ saving ? 'Salvando…' : 'Aplicar status' }}
            </button>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-6 space-y-3">
          <h3 class="text-sm font-semibold text-slate-900">
            Registrar pagamento
          </h3>
          <p v-if="order.payment_status === 'paid'" class="text-sm text-emerald-700">
            Este pedido já está pago.
          </p>
          <div v-else class="flex flex-wrap gap-3 items-end">
            <div class="w-32">
              <label class="form-label">Valor (R$)</label>
              <input v-model.number="payForm.amount" type="number" step="0.01" min="0" class="form-input">
            </div>
            <div class="min-w-[160px]">
              <label class="form-label">Método</label>
              <select v-model="payForm.method" class="form-input">
                <option v-for="m in paymentMethods" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
              </select>
            </div>
            <button type="button" class="btn-primary" :disabled="paySaving" @click="markPaid">
              {{ paySaving ? 'Processando…' : 'Marcar como pago' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
