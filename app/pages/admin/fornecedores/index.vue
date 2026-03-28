<script setup lang="ts">
/**
 * Fornecedores - Lista de fornecedores com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Fornecedores',
})

const { format } = useCurrency()

const suppliers = ref([
  { id: '1', name: 'Tech Import Brasil', contact: 'Carlos Silva', email: 'carlos@techimport.com', phone: '(11) 3333-0001', totalPurchases: 450000, status: 'active' },
  { id: '2', name: 'Apple Distribuidor', contact: 'Ana Santos', email: 'ana@appledist.com', phone: '(11) 3333-0002', totalPurchases: 890000, status: 'active' },
  { id: '3', name: 'Global Acessórios', contact: 'Pedro Mendes', email: 'pedro@global.com', phone: '(11) 3333-0003', totalPurchases: 125000, status: 'active' },
])

const stats = computed(() => ({
  total: suppliers.value.length,
  active: suppliers.value.filter(s => s.status === 'active').length,
  totalPurchases: suppliers.value.reduce((sum, s) => sum + s.totalPurchases, 0),
}))
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Fornecedores"
      description="Gerencie seus fornecedores"
      :breadcrumbs="[{ label: 'Fornecedores' }]"
      :actions="[
        { key: 'new', label: 'Novo Fornecedor', icon: 'lucide:plus', variant: 'primary', to: '/admin/fornecedores/novo' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:truck" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total de fornecedores</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.active }}</p>
            <p class="text-sm text-slate-500">Ativos</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ format(stats.totalPurchases) }}</p>
            <p class="text-sm text-slate-500">Total em compras</p>
          </div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="divide-y divide-slate-50">
        <div
          v-for="supplier in suppliers"
          :key="supplier.id"
          class="flex items-center gap-4 px-5 lg:px-6 py-5 hover:bg-slate-50/50 transition-colors"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {{ supplier.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-900">{{ supplier.name }}</p>
            <p class="text-sm text-slate-500">{{ supplier.contact }} • {{ supplier.email }}</p>
          </div>
          <div class="hidden md:block text-right">
            <p class="font-semibold text-slate-900">{{ format(supplier.totalPurchases) }}</p>
            <p class="text-xs text-slate-500">em compras</p>
          </div>
          <div class="flex items-center gap-1">
            <NuxtLink
              :to="`/admin/fornecedores/${supplier.id}`"
              class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon name="lucide:eye" class="w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="`/admin/fornecedores/${supplier.id}/editar`"
              class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon name="lucide:edit" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
