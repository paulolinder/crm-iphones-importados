<script setup lang="ts">
/**
 * Vendas - Lista de vendas/pedidos com design premium
 */

import type { Order } from '~~/domains/vendas/types'
import type { PaymentMethod } from '~/types'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Vendas',
})

const { format } = useCurrency()
const { formatRelative } = useDateFormat()
const { success, error: showError } = useToast()

const searchQuery = ref('')
const selectedStatus = ref('')
const { orders, loading, error, pagination, updateFilters, loadOrders } = useOrders()
const ordersService = useOrdersService()

const payModalOpen = ref(false)
const payOrder = ref<Order | null>(null)
const payAmount = ref(0)
const payMethod = ref<PaymentMethod>('pix')
const markingPaid = ref(false)

const canMarkPaid = (order: Order) =>
  order.payment_status === 'pending' || order.payment_status === 'partial'

const openPayModal = (order: Order, e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  payOrder.value = order
  payAmount.value = order.total
  payMethod.value = (order.payment_method ?? 'pix') as PaymentMethod
  payModalOpen.value = true
}

const confirmMarkPaid = async () => {
  if (!payOrder.value) {
    return
  }

  markingPaid.value = true

  try {
    await ordersService.registerPayment(payOrder.value.id, payAmount.value, payMethod.value)
    success('Pagamento registrado', 'Pedido marcado como pago. Entrada registrada no financeiro.')
    payModalOpen.value = false
    payOrder.value = null
    await loadOrders()
    await refreshStats()
  }
  catch (err) {
    showError('Erro ao registrar pagamento', err instanceof Error ? err.message : 'Tente novamente.')
  }
  finally {
    markingPaid.value = false
  }
}
const stats = ref({
  today: format(0),
  pending: 0,
  confirmed: 0,
  total: 0,
})

const refreshStats = async () => {
  const response = await ordersService.getStats()
  stats.value = {
    today: format(response.total_revenue),
    pending: response.pending_orders,
    confirmed: orders.value.filter(order => order.status === 'confirmed').length,
    total: response.total_orders,
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'lucide:clock' },
  confirmed: { label: 'Confirmado', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'lucide:check' },
  shipped: { label: 'Enviado', bg: 'bg-violet-50', text: 'text-violet-700', icon: 'lucide:truck' },
  delivered: { label: 'Entregue', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'lucide:check-circle' },
  cancelled: { label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700', icon: 'lucide:x-circle' },
}

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Aguardando', color: 'text-amber-600' },
  partial: { label: 'Parcial', color: 'text-blue-600' },
  paid: { label: 'Pago', color: 'text-emerald-600' },
  refunded: { label: 'Reembolsado', color: 'text-slate-500' },
}

const getOrderStatusUi = (status: string) => statusConfig[status] ?? statusConfig.pending
const getPaymentStatusUi = (status: string) => paymentStatusConfig[status] ?? paymentStatusConfig.pending

const syncFilters = useDebounceFn(async () => {
  updateFilters({
    search: searchQuery.value || undefined,
    status: (selectedStatus.value || undefined) as 'draft' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | undefined,
  })

  pagination.currentPage.value = 1
  await loadOrders()
  await refreshStats()
}, 250)

watch([searchQuery, selectedStatus], () => {
  void syncFilters()
})

watch(() => pagination.currentPage.value, () => {
  void loadOrders()
})

onMounted(async () => {
  await loadOrders()
  await refreshStats()
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Vendas"
      description="Gerencie os pedidos da loja"
      :breadcrumbs="[{ label: 'Vendas' }]"
      :actions="[
        { key: 'export', label: 'Exportar', icon: 'lucide:download', variant: 'outline', to: '/admin/vendas/exportar' },
        { key: 'new', label: 'Nova Venda', icon: 'lucide:plus', variant: 'primary', to: '/admin/vendas/nova' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg shadow-emerald-500/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-2xl font-bold text-white">{{ stats.today }}</p>
            <p class="text-sm text-emerald-100">Vendas hoje</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon name="lucide:clock" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.pending }}</p>
            <p class="text-sm text-slate-500">Pendentes</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:check" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.confirmed }}</p>
            <p class="text-sm text-slate-500">Confirmados</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="lucide:shopping-bag" class="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total de pedidos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Orders -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <!-- Filters -->
      <div class="p-4 lg:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por número ou cliente..."
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <select
          v-model="selectedStatus"
          class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <!-- Orders List -->
      <div class="divide-y divide-slate-50">
        <div
          v-for="order in orders"
          :key="order.id"
          class="flex flex-col lg:flex-row lg:items-center gap-4 px-5 lg:px-6 py-5 hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <!-- Order Info -->
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100">
              <span class="text-sm font-bold text-slate-600">{{ order.number }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="sm:hidden text-sm font-bold text-slate-600">{{ order.number }}</span>
                <span class="font-semibold text-slate-900">{{ order.customer?.name || 'Cliente sem cadastro' }}</span>
                <span
                  class="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="[getOrderStatusUi(order.status).bg, getOrderStatusUi(order.status).text]"
                >
                  <Icon :name="getOrderStatusUi(order.status).icon" class="w-3 h-3" />
                  {{ getOrderStatusUi(order.status).label }}
                </span>
              </div>
              <p class="text-sm text-slate-500 truncate">
                {{ order.items.map(item => `${item.quantity}x ${item.product_name}`).join(', ') }}
              </p>
              <p class="text-xs text-slate-400 mt-1">{{ formatRelative(new Date(order.created_at)) }}</p>
            </div>
          </div>

          <!-- Mobile Status -->
          <div class="flex lg:hidden items-center gap-2">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="[getOrderStatusUi(order.status).bg, getOrderStatusUi(order.status).text]"
            >
              <Icon :name="getOrderStatusUi(order.status).icon" class="w-3 h-3" />
              {{ getOrderStatusUi(order.status).label }}
            </span>
          </div>

          <!-- Payment & Total -->
          <div class="flex items-center justify-between lg:gap-8">
            <div class="hidden lg:block text-right">
              <p :class="getPaymentStatusUi(order.payment_status).color" class="text-sm font-medium">
                {{ getPaymentStatusUi(order.payment_status).label }}
              </p>
              <p class="text-xs text-slate-400 capitalize">{{ order.payment_method?.replace('_', ' ') || 'sem método' }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-slate-900">{{ format(order.total) }}</p>
            </div>
            <div class="flex items-center gap-1 ml-4">
              <button
                v-if="canMarkPaid(order)"
                type="button"
                class="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Marcar como pago"
                @click="openPayModal(order, $event)"
              >
                <Icon name="lucide:banknote" class="w-4 h-4" />
              </button>
              <NuxtLink
                :to="`/admin/vendas/${order.id}`"
                class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Ver detalhes do pedido"
                @click.stop
              >
                <Icon name="lucide:eye" class="w-4 h-4" />
              </NuxtLink>
              <NuxtLink
                :to="`/admin/vendas/${order.id}/editar`"
                class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Editar pedido"
                @click.stop
              >
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="loading" class="py-12 text-center text-sm text-slate-500">
        Carregando pedidos...
      </div>

      <div v-else-if="orders.length === 0" class="py-12 text-center">
        <Icon name="lucide:shopping-cart" class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-slate-900 mb-1">Nenhum pedido encontrado</h3>
        <p class="text-sm text-slate-500">{{ error?.message || 'Tente ajustar os filtros de busca' }}</p>
      </div>
    </div>

    <BaseModal v-model="payModalOpen" title="Marcar como pago" size="md">
      <div v-if="payOrder" class="space-y-4">
        <p class="text-sm text-slate-600">
          Confirme o valor e o método. O pedido será marcado como pago e uma <strong class="font-medium text-slate-800">entrada (receita)</strong> será lançada no financeiro.
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
          <button type="button" class="btn-outline" @click="payModalOpen = false">
            Cancelar
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="markingPaid || payAmount <= 0"
            @click="confirmMarkPaid"
          >
            {{ markingPaid ? 'Salvando…' : 'Confirmar pagamento' }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
