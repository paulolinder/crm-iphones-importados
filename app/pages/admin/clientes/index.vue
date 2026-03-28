<script setup lang="ts">
/**
 * Clientes - Lista de clientes com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Clientes',
})

const { format } = useCurrency()
const searchQuery = ref('')
const selectedStatus = ref('')
const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  vip: 0,
  totalRevenue: 0,
})
const { customers, loading, error, pagination, updateFilters, loadCustomers } = useCustomers()
const customersService = useCustomersService()

const loadStats = async () => {
  const response = await customersService.getStats()

  stats.value = {
    total: response.total,
    active: response.active,
    inactive: response.inactive,
    vip: customers.value.filter(customer => customer.status === 'vip').length,
    totalRevenue: customers.value.reduce((sum, customer) => sum + customer.total_spent, 0),
  }
}

const syncFilters = useDebounceFn(async () => {
  updateFilters({
    search: searchQuery.value || undefined,
    status: (selectedStatus.value || undefined) as 'lead' | 'active' | 'inactive' | 'vip' | 'blocked' | undefined,
  })

  pagination.currentPage.value = 1
  await loadCustomers()
  await loadStats()
}, 250)

watch([searchQuery, selectedStatus], () => {
  void syncFilters()
})

watch(() => pagination.currentPage.value, () => {
  void loadCustomers()
})

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  lead: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  vip: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  blocked: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

const statusLabels: Record<string, string> = {
  lead: 'Lead',
  active: 'Ativo',
  vip: 'VIP',
  inactive: 'Inativo',
  blocked: 'Bloqueado',
}

const getStatusUi = (status: string) => {
  return {
    color: statusColors[status] ?? statusColors.active,
    label: statusLabels[status] ?? 'Ativo',
  }
}

onMounted(async () => {
  await loadCustomers()
  await loadStats()
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Clientes"
      description="Gerencie sua base de clientes"
      :breadcrumbs="[{ label: 'Clientes' }]"
      :actions="[
        { key: 'export', label: 'Exportar', icon: 'lucide:download', variant: 'outline', to: '/admin/clientes/exportar' },
        { key: 'new', label: 'Novo Cliente', icon: 'lucide:plus', variant: 'primary', to: '/admin/clientes/novo' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:users" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total de clientes</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:user-check" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.active }}</p>
            <p class="text-sm text-slate-500">Clientes ativos</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon name="lucide:crown" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.vip }}</p>
            <p class="text-sm text-slate-500">Clientes VIP</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ format(stats.totalRevenue) }}</p>
            <p class="text-sm text-slate-500">Receita total</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <!-- Filters -->
      <div class="p-4 lg:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou email..."
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <select
          v-model="selectedStatus"
          class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="lead">Leads</option>
          <option value="active">Ativos</option>
          <option value="vip">VIP</option>
          <option value="inactive">Inativos</option>
          <option value="blocked">Bloqueados</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="text-left px-5 lg:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th class="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Contato</th>
              <th class="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pedidos</th>
              <th class="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gasto</th>
              <th class="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th class="text-right px-5 lg:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody v-if="customers.length" class="divide-y divide-slate-50">
            <tr
              v-for="customer in customers"
              :key="customer.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-5 lg:px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {{ customer.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium text-slate-900">{{ customer.name }}</p>
                    <p class="text-sm text-slate-500 md:hidden">{{ customer.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 hidden md:table-cell">
                <p class="text-sm text-slate-900">{{ customer.email }}</p>
                <p class="text-sm text-slate-500">{{ customer.phone }}</p>
              </td>
              <td class="text-center px-4 py-4">
                <span class="font-semibold text-slate-700">{{ customer.total_orders }}</span>
              </td>
              <td class="text-right px-4 py-4">
                <span class="font-semibold text-slate-900">{{ format(customer.total_spent) }}</span>
              </td>
              <td class="text-center px-4 py-4 hidden lg:table-cell">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="[getStatusUi(customer.status).color.bg, getStatusUi(customer.status).color.text]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusUi(customer.status).color.dot" />
                  {{ getStatusUi(customer.status).label }}
                </span>
              </td>
              <td class="text-right px-5 lg:px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink
                    :to="`/admin/clientes/${customer.id}`"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/clientes/${customer.id}/editar`"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Icon name="lucide:edit" class="w-4 h-4" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loading" class="px-6 py-10 text-center text-sm text-slate-500">
        Carregando clientes...
      </div>

      <div v-else-if="!customers.length" class="px-6 py-10 text-center">
        <p class="text-sm text-slate-500">
          {{ error?.message || 'Nenhum cliente encontrado para os filtros atuais.' }}
        </p>
      </div>

      <!-- Pagination -->
      <div class="px-5 lg:px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p class="text-sm text-slate-500">
          Mostrando <span class="font-medium">{{ customers.length }}</span> de <span class="font-medium">{{ pagination.totalItems }}</span> clientes
        </p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            :disabled="!pagination.hasPrevPage"
            @click="pagination.prevPage()"
          >
            Anterior
          </button>
          <button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
            {{ pagination.currentPage }}
          </button>
          <button
            class="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            :disabled="!pagination.hasNextPage"
            @click="pagination.nextPage()"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
