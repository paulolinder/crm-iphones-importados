<script setup lang="ts">
/**
 * Estoque - Controle de estoque com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Estoque',
})

const { format } = useCurrency()

const activeTab = ref<'overview' | 'movements' | 'imei'>('overview')

const stats = computed(() => ({
  totalItems: 1256,
  totalValue: 2450000,
  lowStock: 12,
  outOfStock: 3,
}))

const stockItems = ref([
  { id: '1', name: 'iPhone 15 Pro Max 256GB', sku: 'IPH15PM256', stock: 12, reserved: 2, available: 10, minStock: 5, status: 'ok' },
  { id: '2', name: 'iPhone 15 128GB', sku: 'IPH15128', stock: 25, reserved: 5, available: 20, minStock: 10, status: 'ok' },
  { id: '3', name: 'AirPods Pro 2', sku: 'APP2', stock: 3, reserved: 1, available: 2, minStock: 10, status: 'low' },
  { id: '4', name: 'Apple Watch Ultra 2', sku: 'AWU2', stock: 8, reserved: 0, available: 8, minStock: 5, status: 'ok' },
  { id: '5', name: 'MacBook Air M3', sku: 'MBA-M3', stock: 0, reserved: 0, available: 0, minStock: 3, status: 'out' },
])

const recentMovements = ref([
  { id: '1', type: 'entry', product: 'iPhone 15 Pro Max', qty: 20, date: new Date(Date.now() - 1000 * 60 * 30), user: 'Admin' },
  { id: '2', type: 'exit', product: 'AirPods Pro 2', qty: 5, date: new Date(Date.now() - 1000 * 60 * 60), user: 'Vendedor' },
  { id: '3', type: 'entry', product: 'Apple Watch S9', qty: 10, date: new Date(Date.now() - 1000 * 60 * 120), user: 'Admin' },
])

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  ok: { label: 'Normal', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  low: { label: 'Baixo', bg: 'bg-amber-50', text: 'text-amber-700' },
  out: { label: 'Zerado', bg: 'bg-red-50', text: 'text-red-700' },
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Estoque"
      description="Controle de estoque e movimentações"
      :breadcrumbs="[{ label: 'Estoque' }]"
      :actions="[
        { key: 'exit', label: 'Saída', icon: 'lucide:package-minus', variant: 'outline' },
        { key: 'entry', label: 'Entrada', icon: 'lucide:package-plus', variant: 'primary', to: '/admin/estoque/entrada' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:boxes" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.totalItems.toLocaleString() }}</p>
            <p class="text-sm text-slate-500">Itens em estoque</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ format(stats.totalValue) }}</p>
            <p class="text-sm text-slate-500">Valor total</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.lowStock }}</p>
            <p class="text-sm text-slate-500">Estoque baixo</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Icon name="lucide:x-circle" class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.outOfStock }}</p>
            <p class="text-sm text-slate-500">Sem estoque</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="flex border-b border-slate-100">
        <button
          v-for="tab in [
            { key: 'overview', label: 'Visão Geral', icon: 'lucide:layout-grid' },
            { key: 'movements', label: 'Movimentações', icon: 'lucide:arrow-left-right' },
            { key: 'imei', label: 'IMEI/Serial', icon: 'lucide:qr-code' },
          ]"
          :key="tab.key"
          class="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 -mb-px transition-colors"
          :class="[
            activeTab === tab.key
              ? 'text-blue-600 border-blue-600'
              : 'text-slate-500 border-transparent hover:text-slate-700',
          ]"
          @click="activeTab = tab.key as typeof activeTab"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'overview'" class="p-5 lg:p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                <th class="text-center pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estoque</th>
                <th class="text-center pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Reservado</th>
                <th class="text-center pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Disponível</th>
                <th class="text-center pb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in stockItems" :key="item.id" class="hover:bg-slate-50/50">
                <td class="py-4">
                  <div>
                    <p class="font-medium text-slate-900">{{ item.name }}</p>
                    <p class="text-sm text-slate-500">{{ item.sku }}</p>
                  </div>
                </td>
                <td class="text-center py-4">
                  <span class="font-semibold text-slate-700">{{ item.stock }}</span>
                </td>
                <td class="text-center py-4 hidden md:table-cell">
                  <span class="text-slate-500">{{ item.reserved }}</span>
                </td>
                <td class="text-center py-4">
                  <span
                    class="font-semibold"
                    :class="[
                      item.available >= item.minStock ? 'text-emerald-600' : '',
                      item.available < item.minStock && item.available > 0 ? 'text-amber-600' : '',
                      item.available === 0 ? 'text-red-600' : '',
                    ]"
                  >
                    {{ item.available }}
                  </span>
                </td>
                <td class="text-center py-4 hidden lg:table-cell">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="[statusConfig[item.status].bg, statusConfig[item.status].text]"
                  >
                    {{ statusConfig[item.status].label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'movements'" class="p-5 lg:p-6">
        <div class="space-y-4">
          <div
            v-for="movement in recentMovements"
            :key="movement.id"
            class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="movement.type === 'entry' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'"
            >
              <Icon :name="movement.type === 'entry' ? 'lucide:arrow-down' : 'lucide:arrow-up'" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ movement.product }}</p>
              <p class="text-sm text-slate-500">{{ movement.type === 'entry' ? 'Entrada' : 'Saída' }} de {{ movement.qty }} unidades</p>
            </div>
            <div class="text-right text-sm text-slate-500">
              <p>{{ movement.user }}</p>
              <p class="text-xs">há {{ Math.round((Date.now() - movement.date.getTime()) / 60000) }} min</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center">
        <Icon name="lucide:qr-code" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Controle de IMEI/Serial</h3>
        <p class="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          Rastreie produtos individualmente por número IMEI ou serial.
        </p>
        <button class="btn-primary">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Registrar IMEI
        </button>
      </div>
    </div>
  </div>
</template>
