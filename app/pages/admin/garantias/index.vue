<script setup lang="ts">
/**
 * Garantias - Gestão de garantias com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Garantias',
})

const { formatDate } = useDateFormat()

const warranties = ref([
  { id: '1', product: 'iPhone 15 Pro Max', customer: 'João Silva', purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 335), status: 'valid' },
  { id: '2', product: 'AirPods Pro 2', customer: 'Maria Santos', purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), status: 'expiring' },
  { id: '3', product: 'Apple Watch S8', customer: 'Pedro Costa', purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400), expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35), status: 'expired' },
])

const stats = computed(() => ({
  total: warranties.value.length,
  valid: warranties.value.filter(w => w.status === 'valid').length,
  expiring: warranties.value.filter(w => w.status === 'expiring').length,
  expired: warranties.value.filter(w => w.status === 'expired').length,
}))

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  valid: { label: 'Válida', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  expiring: { label: 'Expirando', bg: 'bg-amber-50', text: 'text-amber-700' },
  expired: { label: 'Expirada', bg: 'bg-red-50', text: 'text-red-700' },
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Garantias"
      description="Gestão de garantias dos produtos"
      :breadcrumbs="[{ label: 'Garantias' }]"
      :actions="[
        { key: 'new', label: 'Nova Garantia', icon: 'lucide:plus', variant: 'primary' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:shield" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.valid }}</p>
            <p class="text-sm text-slate-500">Válidas</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.expiring }}</p>
            <p class="text-sm text-slate-500">Expirando</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Icon name="lucide:shield-x" class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.expired }}</p>
            <p class="text-sm text-slate-500">Expiradas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="text-left px-5 lg:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
              <th class="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th class="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Compra</th>
              <th class="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimento</th>
              <th class="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="warranty in warranties" :key="warranty.id" class="hover:bg-slate-50/50">
              <td class="px-5 lg:px-6 py-4">
                <p class="font-medium text-slate-900">{{ warranty.product }}</p>
              </td>
              <td class="px-4 py-4">
                <p class="text-slate-700">{{ warranty.customer }}</p>
              </td>
              <td class="px-4 py-4 hidden md:table-cell">
                <p class="text-slate-500">{{ formatDate(warranty.purchaseDate) }}</p>
              </td>
              <td class="px-4 py-4">
                <p class="text-slate-700">{{ formatDate(warranty.expiresAt) }}</p>
              </td>
              <td class="text-center px-4 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="[statusConfig[warranty.status].bg, statusConfig[warranty.status].text]"
                >
                  {{ statusConfig[warranty.status].label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
