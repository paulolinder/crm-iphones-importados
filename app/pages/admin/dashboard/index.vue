<script setup lang="ts">
/**
 * Dashboard - Página inicial do painel administrativo
 *
 * Design premium com KPIs, gráficos e visão geral do negócio
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Dashboard',
})

const { format } = useCurrency()
const { formatDate, formatRelative } = useDateFormat()

const currentDate = new Date()
const greeting = computed(() => {
  const hour = currentDate.getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const kpis = ref([
  {
    id: 'revenue',
    title: 'Receita do Mês',
    value: 127850,
    previousValue: 98420,
    format: 'currency',
    icon: 'lucide:trending-up',
    trend: 'up',
  },
  {
    id: 'orders',
    title: 'Pedidos',
    value: 156,
    previousValue: 142,
    format: 'number',
    icon: 'lucide:shopping-cart',
    trend: 'up',
  },
  {
    id: 'customers',
    title: 'Novos Clientes',
    value: 48,
    previousValue: 52,
    format: 'number',
    icon: 'lucide:users',
    trend: 'down',
  },
  {
    id: 'ticket',
    title: 'Ticket Médio',
    value: 2450,
    previousValue: 2180,
    format: 'currency',
    icon: 'lucide:receipt',
    trend: 'up',
  },
])

const formatKpiValue = (kpi: typeof kpis.value[0]) => {
  if (kpi.format === 'currency') return format(kpi.value)
  return kpi.value.toLocaleString('pt-BR')
}

const getPercentChange = (current: number, previous: number) => {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

const quickActions = [
  {
    title: 'Nova Venda',
    description: 'Registrar pedido',
    icon: 'lucide:plus-circle',
    to: '/admin/vendas/nova',
  },
  {
    title: 'Novo Cliente',
    description: 'Cadastrar cliente',
    icon: 'lucide:user-plus',
    to: '/admin/clientes/novo',
  },
  {
    title: 'Entrada Estoque',
    description: 'Adicionar produtos',
    icon: 'lucide:package-plus',
    to: '/admin/estoque/entrada',
  },
  {
    title: 'Relatórios',
    description: 'Ver análises',
    icon: 'lucide:bar-chart-3',
    to: '/admin/relatorios',
  },
]

const recentOrders = ref([
  {
    id: '1',
    number: '#2847',
    customer: 'João Silva',
    product: 'iPhone 15 Pro Max 256GB',
    total: 9499,
    status: 'pending',
    date: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    number: '#2846',
    customer: 'Maria Santos',
    product: 'iPhone 15 128GB + AirPods Pro',
    total: 8298,
    status: 'confirmed',
    date: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    number: '#2845',
    customer: 'Pedro Costa',
    product: 'Apple Watch Ultra 2',
    total: 5999,
    status: 'shipped',
    date: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '4',
    number: '#2844',
    customer: 'Ana Oliveira',
    product: 'MacBook Air M3',
    total: 11999,
    status: 'delivered',
    date: new Date(Date.now() - 1000 * 60 * 180),
  },
])

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmado', color: 'text-blue-700', bg: 'bg-blue-50' },
  shipped: { label: 'Enviado', color: 'text-violet-700', bg: 'bg-violet-50' },
  delivered: { label: 'Entregue', color: 'text-emerald-700', bg: 'bg-emerald-50' },
}

const lowStockItems = ref([
  { id: '1', name: 'iPhone 15 Pro Max 256GB', sku: 'IPH15PM256', stock: 2, minStock: 5, image: '' },
  { id: '2', name: 'AirPods Pro 2', sku: 'APP2', stock: 3, minStock: 10, image: '' },
  { id: '3', name: 'Apple Watch Ultra 2', sku: 'AWU2', stock: 1, minStock: 3, image: '' },
])

const topProducts = ref([
  { id: '1', name: 'iPhone 15 Pro Max', sales: 45, revenue: 404505, trend: 12 },
  { id: '2', name: 'iPhone 15', sales: 38, revenue: 246962, trend: 8 },
  { id: '3', name: 'AirPods Pro 2', sales: 62, revenue: 117738, trend: -3 },
  { id: '4', name: 'Apple Watch S9', sales: 28, revenue: 119972, trend: 15 },
])

const weeklyData = ref({
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  values: [18500, 22300, 19800, 28400, 32100, 15600, 12800],
})

const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.values))
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6 lg:space-y-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">
          {{ greeting }}, Administrador
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Aqui está o resumo do seu negócio hoje.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200">
          <Icon name="lucide:calendar" class="w-4 h-4 text-slate-400" />
          <span class="text-sm font-medium text-slate-700">
            {{ formatDate(currentDate, "dd 'de' MMMM 'de' yyyy") }}
          </span>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      <div
        v-for="kpi in kpis"
        :key="kpi.id"
        class="surface-metric lg:p-6"
      >
        <div>
          <!-- Icon & Title -->
          <div class="flex items-center justify-between mb-3">
            <div class="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <Icon :name="kpi.icon" class="w-[18px] h-[18px]" />
            </div>

            <!-- Trend Badge -->
            <div
              class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium tabular-nums"
              :class="[
                kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
              ]"
            >
              <Icon
                :name="kpi.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'"
                class="w-3.5 h-3.5"
              />
              {{ Math.abs(getPercentChange(kpi.value, kpi.previousValue)) }}%
            </div>
          </div>

          <!-- Value -->
          <div class="mb-1">
            <span class="text-2xl lg:text-3xl font-semibold tabular-nums text-slate-900">
              {{ formatKpiValue(kpi) }}
            </span>
          </div>

          <!-- Title -->
          <p class="text-sm text-slate-500">{{ kpi.title }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.title"
        :to="action.to"
        class="flex flex-col items-center text-center gap-2.5 bg-white rounded-lg border border-slate-200 p-4 lg:p-5 transition-colors hover:border-slate-300 hover:bg-slate-50/50"
      >
        <div class="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
          <Icon :name="action.icon" class="w-[18px] h-[18px]" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-slate-900">{{ action.title }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">{{ action.description }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <!-- Recent Orders -->
      <div class="xl:col-span-2 surface-panel">
        <div class="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-slate-100/90">
          <div>
            <h2 class="text-base font-semibold text-slate-900 tracking-tight">Pedidos Recentes</h2>
            <p class="text-sm text-slate-500">Últimas vendas realizadas</p>
          </div>
          <NuxtLink
            to="/admin/vendas"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Ver todos
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="divide-y divide-slate-50">
          <NuxtLink
            v-for="order in recentOrders"
            :key="order.id"
            :to="`/admin/vendas/${order.id}`"
            class="flex items-center gap-4 px-5 lg:px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
          >
            <!-- Order Number -->
            <div class="hidden sm:flex items-center justify-center w-10 h-10 rounded-md bg-slate-100 text-slate-600 font-medium text-xs">
              {{ order.number }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="sm:hidden text-sm font-semibold text-slate-600">{{ order.number }}</span>
                <span class="font-medium text-slate-900">{{ order.customer }}</span>
              </div>
              <p class="text-sm text-slate-500 truncate">{{ order.product }}</p>
            </div>

            <!-- Status -->
            <div
              class="hidden lg:block px-2 py-0.5 rounded-md text-xs font-medium"
              :class="[statusConfig[order.status].bg, statusConfig[order.status].color]"
            >
              {{ statusConfig[order.status].label }}
            </div>

            <!-- Value & Time -->
            <div class="text-right">
              <p class="font-semibold text-slate-900">{{ format(order.total) }}</p>
              <p class="text-xs text-slate-400">{{ formatRelative(order.date) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Side Panel -->
      <div class="space-y-6">
        <!-- Weekly Chart -->
        <div class="surface-metric lg:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-sm font-semibold text-slate-900">Vendas da Semana</h3>
              <p class="text-sm text-slate-500">Últimos 7 dias</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold tabular-nums text-slate-900">{{ format(weeklyData.values.reduce((a, b) => a + b, 0)) }}</p>
              <p class="text-xs text-slate-500">+12% vs semana anterior</p>
            </div>
          </div>

          <!-- Simple Bar Chart -->
          <div class="flex items-end justify-between gap-2 h-32">
            <div
              v-for="(value, index) in weeklyData.values"
              :key="index"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <div
                class="w-full min-h-[4px] rounded-t-sm bg-slate-200 transition-colors hover:bg-slate-300"
                :class="index === 4 ? '!bg-primary-500 hover:!bg-primary-600' : ''"
                :style="{ height: `${(value / maxWeeklyValue) * 100}%` }"
              />
              <span class="text-xs text-slate-400 font-medium">{{ weeklyData.labels[index] }}</span>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="surface-panel">
          <div class="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-slate-100/90">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                <Icon name="lucide:alert-triangle" class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-900">Estoque Baixo</h3>
                <p class="text-xs text-slate-500">{{ lowStockItems.length }} produtos</p>
              </div>
            </div>
            <NuxtLink
              to="/admin/estoque"
              class="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Ver todos
            </NuxtLink>
          </div>

          <div class="divide-y divide-slate-50">
            <div
              v-for="item in lowStockItems"
              :key="item.id"
              class="flex items-center gap-3 px-5 lg:px-6 py-3 hover:bg-slate-50/50 transition-colors"
            >
              <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon name="lucide:package" class="w-5 h-5 text-slate-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">{{ item.name }}</p>
                <p class="text-xs text-slate-400">{{ item.sku }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-md bg-red-50 text-red-700 text-xs font-semibold tabular-nums">
                  {{ item.stock }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="surface-panel">
      <div class="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-slate-100/90">
        <div>
          <h2 class="text-base font-semibold text-slate-900 tracking-tight">Produtos Mais Vendidos</h2>
          <p class="text-sm text-slate-500">Performance do mês</p>
        </div>
        <NuxtLink
          to="/admin/relatorios"
          class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          Ver relatório completo
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="text-left px-5 lg:px-6 py-2.5 text-xs font-medium text-slate-500">Produto</th>
              <th class="text-center px-4 py-2.5 text-xs font-medium text-slate-500">Vendas</th>
              <th class="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Receita</th>
              <th class="text-right px-5 lg:px-6 py-2.5 text-xs font-medium text-slate-500">Tendência</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-5 lg:px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 text-slate-600 font-medium text-xs tabular-nums">
                    {{ index + 1 }}
                  </div>
                  <span class="font-medium text-slate-900">{{ product.name }}</span>
                </div>
              </td>
              <td class="text-center px-4 py-4">
                <span class="font-semibold text-slate-700">{{ product.sales }}</span>
              </td>
              <td class="text-right px-4 py-4">
                <span class="font-semibold text-slate-900">{{ format(product.revenue) }}</span>
              </td>
              <td class="text-right px-5 lg:px-6 py-4">
                <span
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium tabular-nums"
                  :class="product.trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
                >
                  <Icon
                    :name="product.trend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                    class="w-3 h-3"
                  />
                  {{ Math.abs(product.trend) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
