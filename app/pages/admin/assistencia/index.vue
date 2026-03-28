<script setup lang="ts">
/**
 * Assistência Técnica - Ordens de serviço com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Assistência Técnica',
})

const { format } = useCurrency()
const { formatDate, formatRelative } = useDateFormat()

const orders = ref([
  { id: '1', number: 'OS-2024-001', customer: 'João Silva', device: 'iPhone 14 Pro', issue: 'Tela quebrada', status: 'pending', createdAt: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '2', number: 'OS-2024-002', customer: 'Maria Santos', device: 'iPhone 13', issue: 'Bateria fraca', status: 'diagnosing', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '3', number: 'OS-2024-003', customer: 'Pedro Costa', device: 'MacBook Pro', issue: 'Não liga', status: 'in_repair', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: '4', number: 'OS-2024-004', customer: 'Ana Oliveira', device: 'Apple Watch S7', issue: 'Tela riscada', status: 'ready', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
])

const stats = computed(() => ({
  pending: orders.value.filter(o => o.status === 'pending').length,
  inProgress: orders.value.filter(o => ['diagnosing', 'in_repair', 'waiting_parts'].includes(o.status)).length,
  ready: orders.value.filter(o => o.status === 'ready').length,
  total: orders.value.length,
}))

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Aguardando', bg: 'bg-slate-100', text: 'text-slate-700', icon: 'lucide:clock' },
  diagnosing: { label: 'Diagnosticando', bg: 'bg-blue-50', text: 'text-blue-700', icon: 'lucide:search' },
  waiting_parts: { label: 'Aguardando Peças', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'lucide:package' },
  in_repair: { label: 'Em Reparo', bg: 'bg-violet-50', text: 'text-violet-700', icon: 'lucide:wrench' },
  ready: { label: 'Pronto', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'lucide:check-circle' },
  delivered: { label: 'Entregue', bg: 'bg-slate-100', text: 'text-slate-600', icon: 'lucide:check' },
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Assistência Técnica"
      description="Ordens de serviço e reparos"
      :breadcrumbs="[{ label: 'Assistência' }]"
      :actions="[
        { key: 'new', label: 'Nova OS', icon: 'lucide:plus', variant: 'primary', to: '/admin/assistencia/nova' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Icon name="lucide:clock" class="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.pending }}</p>
            <p class="text-sm text-slate-500">Aguardando</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:wrench" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.inProgress }}</p>
            <p class="text-sm text-slate-500">Em andamento</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.ready }}</p>
            <p class="text-sm text-slate-500">Prontos</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="lucide:clipboard-list" class="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total de OS</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="divide-y divide-slate-50">
        <div
          v-for="order in orders"
          :key="order.id"
          class="flex flex-col lg:flex-row lg:items-center gap-4 px-5 lg:px-6 py-5 hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="hidden sm:flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100">
              <Icon name="lucide:smartphone" class="w-6 h-6 text-slate-500" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-blue-600">{{ order.number }}</span>
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="[statusConfig[order.status].bg, statusConfig[order.status].text]"
                >
                  <Icon :name="statusConfig[order.status].icon" class="w-3 h-3" />
                  {{ statusConfig[order.status].label }}
                </span>
              </div>
              <p class="font-medium text-slate-900">{{ order.device }}</p>
              <p class="text-sm text-slate-500">{{ order.customer }} • {{ order.issue }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between lg:gap-4">
            <div class="text-sm text-slate-500">
              {{ formatRelative(order.createdAt) }}
            </div>
            <div class="flex items-center gap-1">
              <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="lucide:eye" class="w-4 h-4" />
              </button>
              <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Icon name="lucide:edit" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
