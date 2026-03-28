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
const { stockItems, stockLoading, stockError, movements, movementsLoading, movementsError, loadStock, loadMovements } = useInventory()
const inventoryService = useInventoryService()
const stats = ref({
  totalItems: 0,
  totalValue: 0,
  lowStock: 0,
  outOfStock: 0,
})

const refreshStats = async () => {
  const response = await inventoryService.getStats()
  stats.value = {
    totalItems: response.total_items,
    totalValue: response.total_value,
    lowStock: response.low_stock_count,
    outOfStock: response.out_of_stock_count,
  }
}

watch(activeTab, async (tab) => {
  if (tab === 'movements') {
    await loadMovements()
    return
  }

  if (tab === 'overview') {
    await loadStock()
  }
})

onMounted(async () => {
  await loadStock()
  await refreshStats()
})

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  in_stock: { label: 'Normal', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  low_stock: { label: 'Baixo', bg: 'bg-amber-50', text: 'text-amber-700' },
  out_of_stock: { label: 'Zerado', bg: 'bg-red-50', text: 'text-red-700' },
}

const getStockUi = (status: string) => statusConfig[status] ?? statusConfig.in_stock

const { info: toastInfo } = useToast()

function onRegisterImeiClick() {
  toastInfo('Em breve', 'O cadastro em lote de IMEI/serial será integrado ao estoque rastreável.')
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
        { key: 'mov', label: 'Movimentações', icon: 'lucide:arrow-left-right', variant: 'ghost', to: '/admin/estoque/movimentacoes' },
        { key: 'exit', label: 'Saída', icon: 'lucide:package-minus', variant: 'outline', to: '/admin/estoque/saida' },
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
              <tr v-for="item in stockItems" :key="item.product_id" class="hover:bg-slate-50/50">
                <td class="py-4">
                  <div>
                    <p class="font-medium text-slate-900">{{ item.product_name }}</p>
                    <p class="text-sm text-slate-500">{{ item.sku }}</p>
                  </div>
                </td>
                <td class="text-center py-4">
                  <span class="font-semibold text-slate-700">{{ item.quantity }}</span>
                </td>
                <td class="text-center py-4 hidden md:table-cell">
                  <span class="text-slate-500">{{ item.reserved }}</span>
                </td>
                <td class="text-center py-4">
                  <span
                    class="font-semibold"
                    :class="[
                      item.available >= item.min_stock ? 'text-emerald-600' : '',
                      item.available < item.min_stock && item.available > 0 ? 'text-amber-600' : '',
                      item.available === 0 ? 'text-red-600' : '',
                    ]"
                  >
                    {{ item.available }}
                  </span>
                </td>
                <td class="text-center py-4 hidden lg:table-cell">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="[getStockUi(item.status).bg, getStockUi(item.status).text]"
                  >
                    {{ getStockUi(item.status).label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="stockLoading" class="pt-6 text-center text-sm text-slate-500">
          Carregando estoque...
        </div>

        <div v-else-if="!stockItems.length" class="pt-6 text-center text-sm text-slate-500">
          {{ stockError?.message || 'Nenhum item de estoque encontrado.' }}
        </div>
      </div>

      <div v-else-if="activeTab === 'movements'" class="p-5 lg:p-6">
        <div class="space-y-4">
          <div
            v-for="movement in movements"
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
              <p class="font-medium text-slate-900">{{ movement.product?.name || 'Produto' }}</p>
              <p class="text-sm text-slate-500">{{ movement.type === 'entry' ? 'Entrada' : 'Saída' }} de {{ movement.quantity }} unidades</p>
            </div>
            <div class="text-right text-sm text-slate-500">
              <p>{{ movement.user?.name || 'Sistema' }}</p>
              <p class="text-xs">há {{ Math.round((Date.now() - new Date(movement.created_at).getTime()) / 60000) }} min</p>
            </div>
          </div>
        </div>

        <div v-if="movementsLoading" class="pt-6 text-center text-sm text-slate-500">
          Carregando movimentações...
        </div>

        <div v-else-if="!movements.length" class="pt-6 text-center text-sm text-slate-500">
          {{ movementsError?.message || 'Nenhuma movimentação registrada até o momento.' }}
        </div>
      </div>

      <div v-else class="p-12 text-center">
        <Icon name="lucide:qr-code" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Controle de IMEI/Serial</h3>
        <p class="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          Rastreie produtos individualmente por número IMEI ou serial.
        </p>
        <button type="button" class="btn-primary" @click="onRegisterImeiClick">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Registrar IMEI
        </button>
      </div>
    </div>
  </div>
</template>
