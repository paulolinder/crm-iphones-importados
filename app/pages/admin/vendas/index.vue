<script setup lang="ts">
/**
 * Vendas - Lista de vendas/pedidos com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Vendas',
})

const { format } = useCurrency()
const { formatDate, formatRelative } = useDateFormat()

const searchQuery = ref('')
const selectedStatus = ref('')

const orders = ref([
  {
    id: '1',
    number: '#2847',
    customer: { name: 'João Silva', email: 'joao@email.com' },
    items: [{ name: 'iPhone 15 Pro Max 256GB', qty: 1 }],
    total: 9499,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'pix',
    date: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    number: '#2846',
    customer: { name: 'Maria Santos', email: 'maria@email.com' },
    items: [{ name: 'iPhone 15 128GB', qty: 1 }, { name: 'AirPods Pro 2', qty: 1 }],
    total: 8298,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    date: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    number: '#2845',
    customer: { name: 'Pedro Costa', email: 'pedro@email.com' },
    items: [{ name: 'Apple Watch Ultra 2', qty: 1 }],
    total: 5999,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    date: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '4',
    number: '#2844',
    customer: { name: 'Ana Oliveira', email: 'ana@email.com' },
    items: [{ name: 'MacBook Air M3', qty: 1 }],
    total: 11999,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    date: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: '5',
    number: '#2843',
    customer: { name: 'Carlos Mendes', email: 'carlos@email.com' },
    items: [{ name: 'iPad Pro 12.9"', qty: 1 }],
    total: 8999,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'pix',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
])

const stats = computed(() => ({
  today: format(orders.value.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)),
  pending: orders.value.filter(o => o.status === 'pending').length,
  confirmed: orders.value.filter(o => o.status === 'confirmed').length,
  total: orders.value.length,
}))

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'lucide:clock' },
  confirmed: { label: 'Confirmado', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'lucide:check' },
  shipped: { label: 'Enviado', bg: 'bg-violet-50', text: 'text-violet-700', icon: 'lucide:truck' },
  delivered: { label: 'Entregue', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'lucide:check-circle' },
  cancelled: { label: 'Cancelado', bg: 'bg-red-50', text: 'text-red-700', icon: 'lucide:x-circle' },
}

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Aguardando', color: 'text-amber-600' },
  paid: { label: 'Pago', color: 'text-emerald-600' },
  refunded: { label: 'Reembolsado', color: 'text-slate-500' },
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = !searchQuery.value ||
      order.number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !selectedStatus.value || order.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
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
        { key: 'export', label: 'Exportar', icon: 'lucide:download', variant: 'outline' },
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
          v-for="order in filteredOrders"
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
                <span class="font-semibold text-slate-900">{{ order.customer.name }}</span>
                <span
                  class="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="[statusConfig[order.status].bg, statusConfig[order.status].text]"
                >
                  <Icon :name="statusConfig[order.status].icon" class="w-3 h-3" />
                  {{ statusConfig[order.status].label }}
                </span>
              </div>
              <p class="text-sm text-slate-500 truncate">
                {{ order.items.map(i => `${i.qty}x ${i.name}`).join(', ') }}
              </p>
              <p class="text-xs text-slate-400 mt-1">{{ formatRelative(order.date) }}</p>
            </div>
          </div>

          <!-- Mobile Status -->
          <div class="flex lg:hidden items-center gap-2">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="[statusConfig[order.status].bg, statusConfig[order.status].text]"
            >
              <Icon :name="statusConfig[order.status].icon" class="w-3 h-3" />
              {{ statusConfig[order.status].label }}
            </span>
          </div>

          <!-- Payment & Total -->
          <div class="flex items-center justify-between lg:gap-8">
            <div class="hidden lg:block text-right">
              <p :class="paymentStatusConfig[order.paymentStatus].color" class="text-sm font-medium">
                {{ paymentStatusConfig[order.paymentStatus].label }}
              </p>
              <p class="text-xs text-slate-400 capitalize">{{ order.paymentMethod.replace('_', ' ') }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-slate-900">{{ format(order.total) }}</p>
            </div>
            <div class="flex items-center gap-1 ml-4">
              <NuxtLink
                :to="`/admin/vendas/${order.id}`"
                class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Icon name="lucide:eye" class="w-4 h-4" />
              </NuxtLink>
              <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="lucide:more-horizontal" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="py-12 text-center">
        <Icon name="lucide:shopping-cart" class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-slate-900 mb-1">Nenhum pedido encontrado</h3>
        <p class="text-sm text-slate-500">Tente ajustar os filtros de busca</p>
      </div>
    </div>
  </div>
</template>
