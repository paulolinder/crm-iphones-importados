<script setup lang="ts">
/**
 * Financeiro - Controle financeiro com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Financeiro',
})

const { format } = useCurrency()
const { formatDate } = useDateFormat()

const { transactions, loading, error, loadTransactions, getSummary } = useFinance()
const stats = ref({
  balance: 185000,
  receivables: 45000,
  payables: 18000,
  monthlyProfit: 32000,
})

const weeklyData = [
  { day: 'Seg', income: 18500, expense: 5200 },
  { day: 'Ter', income: 22300, expense: 8100 },
  { day: 'Qua', income: 19800, expense: 3500 },
  { day: 'Qui', income: 28400, expense: 12000 },
  { day: 'Sex', income: 32100, expense: 6800 },
  { day: 'Sáb', income: 15600, expense: 2100 },
  { day: 'Dom', income: 12800, expense: 1500 },
]

const maxValue = Math.max(...weeklyData.map(d => Math.max(d.income, d.expense)))

onMounted(async () => {
  const [summary] = await Promise.all([
    getSummary(),
    loadTransactions(),
  ])

  stats.value = summary
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Financeiro"
      description="Saldo e lucro do mês vêm dos lançamentos (entradas/saídas). Ao marcar uma venda como paga, a receita entra aqui. Saídas de estoque ficam em Estoque."
      :breadcrumbs="[{ label: 'Financeiro' }]"
      :actions="[
        { key: 'export', label: 'Exportar', icon: 'lucide:download', variant: 'outline', to: '/admin/financeiro/exportar' },
        { key: 'new', label: 'Nova Transação', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/lancamentos/novo' },
      ]"
    />

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <NuxtLink
        v-for="item in [
          { label: 'Caixa', to: '/admin/financeiro/caixa', icon: 'lucide:banknote' },
          { label: 'A pagar', to: '/admin/financeiro/contas-pagar', icon: 'lucide:arrow-up-circle' },
          { label: 'A receber', to: '/admin/financeiro/contas-receber', icon: 'lucide:arrow-down-circle' },
          { label: 'Lançamentos', to: '/admin/financeiro/lancamentos', icon: 'lucide:list' },
          { label: 'Exportar', to: '/admin/financeiro/exportar', icon: 'lucide:download' },
          { label: 'Vendas', to: '/admin/vendas', icon: 'lucide:shopping-cart' },
        ]"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-slate-200/70 shadow-sm text-sm font-medium text-slate-700 hover:border-primary-200 hover:text-primary-700 transition-colors"
      >
        <Icon :name="item.icon" class="w-4 h-4 text-slate-400" />
        {{ item.label }}
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Balance Card -->
      <div class="bg-primary-600 rounded-lg p-5 text-white">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium text-blue-100">Saldo Atual</span>
        </div>
        <p class="text-3xl font-semibold tabular-nums">{{ format(stats.balance) }}</p>
      </div>

      <div class="surface-metric">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
            <Icon name="lucide:arrow-down-circle" class="w-5 h-5 text-slate-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">A Receber</span>
        </div>
        <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ format(stats.receivables) }}</p>
        <p class="text-xs text-slate-500 mt-1">
          Soma de contas a receber ainda pendentes (inclui pedidos não pagos, quando geradas)
        </p>
      </div>

      <div class="surface-metric">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
            <Icon name="lucide:arrow-up-circle" class="w-5 h-5 text-slate-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">A Pagar</span>
        </div>
        <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ format(stats.payables) }}</p>
        <p class="text-xs text-slate-500 mt-1">
          Contas a pagar pendentes ou parciais
        </p>
      </div>

      <div class="surface-metric">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-5 h-5 text-slate-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">Lucro do Mês</span>
        </div>
        <p class="text-2xl font-semibold tabular-nums text-slate-900">{{ format(stats.monthlyProfit) }}</p>
        <p class="text-xs text-slate-500 mt-1">
          Receitas − despesas dos lançamentos deste mês
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="xl:col-span-2 surface-metric lg:p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-semibold text-slate-900">Fluxo da Semana</h3>
            <p class="text-sm text-slate-500">Entradas vs Saídas</p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500" />
              <span class="text-slate-600">Entradas</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-400" />
              <span class="text-slate-600">Saídas</span>
            </div>
          </div>
        </div>

        <div class="flex items-end justify-between gap-4 h-48">
          <div
            v-for="(day, index) in weeklyData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div class="w-full flex items-end gap-1 h-40">
              <div
                class="flex-1 rounded-t-lg bg-emerald-400 transition-all hover:bg-emerald-500"
                :style="{ height: `${(day.income / maxValue) * 100}%` }"
              />
              <div
                class="flex-1 rounded-t-lg bg-red-300 transition-all hover:bg-red-400"
                :style="{ height: `${(day.expense / maxValue) * 100}%` }"
              />
            </div>
            <span class="text-xs text-slate-500 font-medium">{{ day.day }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="surface-panel">
        <div class="px-5 lg:px-6 py-4 border-b border-slate-100/90">
          <h3 class="font-semibold text-slate-900">Transações Recentes</h3>
        </div>

        <div class="divide-y divide-slate-50">
          <div
            v-for="transaction in transactions.slice(0, 6)"
            :key="transaction.id"
            class="flex items-center gap-3 px-5 lg:px-6 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="transaction.transaction_type === 'income' ? 'bg-emerald-100' : 'bg-red-100'"
            >
              <Icon
                :name="transaction.transaction_type === 'income' ? 'lucide:arrow-down' : 'lucide:arrow-up'"
                class="w-5 h-5"
                :class="transaction.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ transaction.description }}</p>
              <p class="text-xs text-slate-500">{{ formatDate(new Date(transaction.occurred_at), 'dd/MM HH:mm') }}</p>
            </div>
            <div class="text-right">
              <p
                class="font-semibold"
                :class="transaction.transaction_type === 'income' ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ transaction.transaction_type === 'income' ? '+' : '-' }}{{ format(transaction.amount) }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="loading" class="px-6 py-8 text-center text-sm text-slate-500">
          Carregando transações...
        </div>

        <div v-else-if="!transactions.length" class="px-6 py-8 text-center text-sm text-slate-500">
          {{ error?.message || 'Nenhuma transação encontrada.' }}
        </div>

        <div class="px-5 lg:px-6 py-3 border-t border-slate-100">
          <NuxtLink
            to="/admin/financeiro/lancamentos"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas as transações
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
