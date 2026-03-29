<script setup lang="ts">
/**
 * Pedidos — operação do dia a dia (lista, filtros, integração Supabase)
 */

definePageMeta({
  layout: 'admin',
  pageTransition: false,
})

useHead({
  title: 'Pedidos',
})

const { format } = useCurrency()
const { formatRelative } = useDateFormat()

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPayment = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const { orders, loading, error, pagination, updateFilters, loadOrders } = useOrders()
const {
  currentPage,
  totalItems,
  perPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
} = pagination
const ordersService = useOrdersService()

const stats = ref({
  revenue: format(0),
  pending: 0,
  awaitingPayment: 0,
  total: 0,
})

const refreshStats = async () => {
  const response = await ordersService.getStats()
  stats.value = {
    revenue: format(response.total_revenue),
    pending: response.pending_orders,
    awaitingPayment: response.pending_payment,
    total: response.total_orders,
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  draft: { label: 'Rascunho', bg: 'bg-slate-100', text: 'text-slate-700', icon: 'lucide:file-edit' },
  pending: { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'lucide:clock' },
  confirmed: { label: 'Confirmado', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'lucide:check' },
  processing: { label: 'Separando', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'lucide:package' },
  shipped: { label: 'Enviado', bg: 'bg-violet-50', text: 'text-violet-700', icon: 'lucide:truck' },
  delivered: { label: 'Entregue', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'lucide:check-circle' },
  cancelled: { label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700', icon: 'lucide:x-circle' },
  returned: { label: 'Devolvido', bg: 'bg-orange-50', text: 'text-orange-700', icon: 'lucide:undo-2' },
}

const paymentConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pagamento pendente', color: 'text-amber-600' },
  paid: { label: 'Pago', color: 'text-emerald-600' },
  partial: { label: 'Parcial', color: 'text-blue-600' },
  refunded: { label: 'Reembolsado', color: 'text-slate-500' },
  failed: { label: 'Falhou', color: 'text-red-600' },
  cancelled: { label: 'Cancelado', color: 'text-slate-400' },
}

const getStatusUi = (status: string) => statusConfig[status] ?? statusConfig.pending
const getPaymentUi = (status: string) => paymentConfig[status] ?? paymentConfig.pending

const syncFilters = useDebounceFn(async () => {
  updateFilters({
    search: searchQuery.value || undefined,
    status: (selectedStatus.value || undefined) as
      | 'draft'
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled'
      | 'returned'
      | undefined,
    payment_status: (selectedPayment.value || undefined) as
      | 'pending'
      | 'paid'
      | 'partial'
      | 'refunded'
      | 'failed'
      | 'cancelled'
      | undefined,
    date_from: dateFrom.value ? `${dateFrom.value}T00:00:00.000Z` : undefined,
    date_to: dateTo.value ? `${dateTo.value}T23:59:59.999Z` : undefined,
  })

  currentPage.value = 1
  await loadOrders()
  await refreshStats()
}, 280)

watch([searchQuery, selectedStatus, selectedPayment, dateFrom, dateTo], () => {
  void syncFilters()
})

watch(currentPage, () => {
  void loadOrders()
})

onMounted(async () => {
  await loadOrders()
  try {
    await refreshStats()
  }
  catch (e) {
    console.error('[pedidos] getStats', e)
  }
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Pedidos"
      description="Acompanhe e gerencie todos os pedidos da loja"
      :breadcrumbs="[{ label: 'Pedidos' }]"
      :actions="[
        { key: 'new', label: 'Novo pedido', icon: 'lucide:plus', variant: 'primary', to: '/admin/pedidos/novo' },
        { key: 'vendas', label: 'Ver vendas', icon: 'lucide:shopping-cart', variant: 'outline', to: '/admin/vendas' },
      ]"
    />

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
        <div class="flex items-center gap-3 mb-2">
          <Icon name="lucide:wallet" class="w-6 h-6 text-blue-100" />
          <span class="text-sm font-medium text-blue-100">Faturamento (todos)</span>
        </div>
        <p class="text-2xl font-bold">
          {{ stats.revenue }}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <Icon name="lucide:clipboard-list" class="w-6 h-6 text-slate-400" />
          <span class="text-sm text-slate-500">Total de pedidos</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">
          {{ stats.total }}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <Icon name="lucide:clock" class="w-6 h-6 text-amber-500" />
          <span class="text-sm text-slate-500">Aguardando ação</span>
        </div>
        <p class="text-2xl font-bold text-amber-700">
          {{ stats.pending }}
        </p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <Icon name="lucide:credit-card" class="w-6 h-6 text-violet-500" />
          <span class="text-sm text-slate-500">Pagamento pendente</span>
        </div>
        <p class="text-2xl font-bold text-violet-700">
          {{ stats.awaitingPayment }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-4 lg:p-5 border-b border-slate-100">
        <div class="flex flex-col xl:flex-row gap-4">
          <div class="flex-1 relative min-w-0">
            <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por número do pedido ou nome do cliente..."
              class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="selectedStatus"
              class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm min-w-[160px]"
            >
              <option value="">
                Todos os status
              </option>
              <option value="pending">
                Pendente
              </option>
              <option value="confirmed">
                Confirmado
              </option>
              <option value="processing">
                Separando
              </option>
              <option value="shipped">
                Enviado
              </option>
              <option value="delivered">
                Entregue
              </option>
              <option value="cancelled">
                Cancelado
              </option>
            </select>
            <select
              v-model="selectedPayment"
              class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm min-w-[180px]"
            >
              <option value="">
                Pagamento (todos)
              </option>
              <option value="pending">
                Pagamento pendente
              </option>
              <option value="paid">
                Pago
              </option>
              <option value="partial">
                Parcial
              </option>
            </select>
            <input
              v-model="dateFrom"
              type="date"
              class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
            <input
              v-model="dateTo"
              type="date"
              class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
          </div>
        </div>
      </div>

      <div v-if="loading" class="py-16 text-center text-sm text-slate-500">
        Carregando pedidos…
      </div>
      <div v-else-if="error" class="px-6 py-8 text-center text-sm text-red-600">
        {{ error?.message || 'Não foi possível carregar os pedidos.' }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50/80 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th class="px-5 py-3">
                Pedido
              </th>
              <th class="px-4 py-3">
                Cliente
              </th>
              <th class="px-4 py-3 hidden lg:table-cell">
                Status
              </th>
              <th class="px-4 py-3 hidden md:table-cell">
                Pagamento
              </th>
              <th class="px-4 py-3 text-right">
                Total
              </th>
              <th class="px-5 py-3 text-right w-28">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="px-5 py-4">
                <p class="font-semibold text-slate-900">
                  {{ order.number }}
                </p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ formatRelative(new Date(order.created_at)) }}
                </p>
              </td>
              <td class="px-4 py-4">
                <p class="font-medium text-slate-800">
                  {{ order.customer?.name || '—' }}
                </p>
                <p class="text-xs text-slate-500 truncate max-w-[200px]">
                  {{ order.customer?.phone || order.customer?.email || '' }}
                </p>
              </td>
              <td class="px-4 py-4 hidden lg:table-cell">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="[getStatusUi(order.status).bg, getStatusUi(order.status).text]"
                >
                  <Icon :name="getStatusUi(order.status).icon" class="w-3.5 h-3.5" />
                  {{ getStatusUi(order.status).label }}
                </span>
              </td>
              <td class="px-4 py-4 hidden md:table-cell">
                <span class="text-xs font-medium" :class="getPaymentUi(order.payment_status).color">
                  {{ getPaymentUi(order.payment_status).label }}
                </span>
              </td>
              <td class="px-4 py-4 text-right font-semibold text-slate-900">
                {{ format(order.total) }}
              </td>
              <td class="px-5 py-4 text-right">
                <NuxtLink
                  :to="`/admin/pedidos/${order.id}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Abrir
                  <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loading && !error && !orders.length" class="py-16 text-center">
        <Icon name="lucide:inbox" class="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p class="text-slate-600 font-medium">
          Nenhum pedido encontrado
        </p>
        <p class="text-sm text-slate-500 mt-1">
          Ajuste os filtros ou registre um novo pedido.
        </p>
        <NuxtLink to="/admin/pedidos/novo" class="inline-block mt-4 btn-primary text-sm">
          Novo pedido
        </NuxtLink>
      </div>

      <div
        v-if="orders.length"
        class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <p class="text-sm text-slate-500">
          Página <span class="font-medium text-slate-800">{{ currentPage }}</span>
          de <span class="font-medium">{{ Math.max(1, Math.ceil(totalItems / perPage)) }}</span>
          · <span class="font-medium">{{ totalItems }}</span> pedidos
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            :disabled="!hasPrevPage"
            @click="prevPage()"
          >
            Anterior
          </button>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            :disabled="!hasNextPage"
            @click="nextPage()"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
