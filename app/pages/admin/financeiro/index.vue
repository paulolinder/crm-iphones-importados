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

const activeTab = ref<'overview' | 'receivables' | 'payables'>('overview')

const stats = ref({
  balance: 185000,
  receivables: 45000,
  payables: 18000,
  monthlyProfit: 32000,
})

const recentTransactions = ref([
  { id: '1', type: 'income', description: 'Venda #2847 - João Silva', value: 9499, date: new Date(Date.now() - 1000 * 60 * 30), status: 'completed' },
  { id: '2', type: 'income', description: 'Venda #2846 - Maria Santos', value: 8298, date: new Date(Date.now() - 1000 * 60 * 60), status: 'completed' },
  { id: '3', type: 'expense', description: 'Fornecedor - Tech Import', value: 25000, date: new Date(Date.now() - 1000 * 60 * 120), status: 'completed' },
  { id: '4', type: 'income', description: 'Venda #2845 - Pedro Costa', value: 5999, date: new Date(Date.now() - 1000 * 60 * 180), status: 'pending' },
])

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
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Financeiro"
      description="Controle financeiro e fluxo de caixa"
      :breadcrumbs="[{ label: 'Financeiro' }]"
      :actions="[
        { key: 'export', label: 'Exportar', icon: 'lucide:download', variant: 'outline' },
        { key: 'new', label: 'Nova Transação', icon: 'lucide:plus', variant: 'primary' },
      ]"
    />

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20 text-white">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5" />
          </div>
          <span class="text-sm font-medium text-blue-100">Saldo Atual</span>
        </div>
        <p class="text-3xl font-bold">{{ format(stats.balance) }}</p>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:arrow-down-circle" class="w-5 h-5 text-emerald-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">A Receber</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ format(stats.receivables) }}</p>
        <p class="text-xs text-emerald-600 mt-1">+12 parcelas pendentes</p>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Icon name="lucide:arrow-up-circle" class="w-5 h-5 text-red-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">A Pagar</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ format(stats.payables) }}</p>
        <p class="text-xs text-red-600 mt-1">5 contas próximas</p>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-5 h-5 text-violet-600" />
          </div>
          <span class="text-sm font-medium text-slate-500">Lucro do Mês</span>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ format(stats.monthlyProfit) }}</p>
        <p class="text-xs text-emerald-600 mt-1">+18% vs mês anterior</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="xl:col-span-2 bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-100">
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
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-5 lg:px-6 py-4 border-b border-slate-100">
          <h3 class="font-semibold text-slate-900">Transações Recentes</h3>
        </div>

        <div class="divide-y divide-slate-50">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center gap-3 px-5 lg:px-6 py-4 hover:bg-slate-50/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'"
            >
              <Icon
                :name="transaction.type === 'income' ? 'lucide:arrow-down' : 'lucide:arrow-up'"
                class="w-5 h-5"
                :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ transaction.description }}</p>
              <p class="text-xs text-slate-500">{{ formatDate(transaction.date, 'dd/MM HH:mm') }}</p>
            </div>
            <div class="text-right">
              <p
                class="font-semibold"
                :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}{{ format(transaction.value) }}
              </p>
            </div>
          </div>
        </div>

        <div class="px-5 lg:px-6 py-3 border-t border-slate-100">
          <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas as transações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
