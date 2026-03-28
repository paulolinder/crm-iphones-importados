<script setup lang="ts">
import type { Customer } from '~~/domains/clientes/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const customerId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const { format } = useCurrency()
const service = useCustomersService()
const customer = ref<Customer | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const load = async () => {
  if (!customerId.value) {
    return
  }

  loading.value = true
  loadError.value = null

  try {
    customer.value = await service.getById(customerId.value)
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Cliente não encontrado'
    customer.value = null
  }
  finally {
    loading.value = false
  }
}

watch(customerId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() => customer.value?.name ? `${customer.value.name} — Cliente` : 'Cliente'),
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes do cliente"
      :description="customer?.name || 'Carregando…'"
      :breadcrumbs="[
        { label: 'Clientes', to: '/admin/clientes' },
        { label: customer?.name || 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/clientes/${customerId}/editar` },
        { key: 'list', label: 'Voltar à lista', variant: 'outline', to: '/admin/clientes' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando cliente…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
    </div>
    <template v-else-if="customer">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Contato
          </p>
          <p class="mt-2 text-sm text-slate-900">
            {{ customer.email || '—' }}
          </p>
          <p class="text-sm text-slate-600">
            {{ customer.phone || customer.mobile || '—' }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Pedidos / gasto
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ customer.total_orders }}
          </p>
          <p class="text-sm text-slate-500">
            Total gasto: {{ format(customer.total_spent) }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Status
          </p>
          <p class="mt-2 text-sm font-medium text-slate-900 capitalize">
            {{ customer.status }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-3">
          Observações
        </h3>
        <p class="text-sm text-slate-600 whitespace-pre-wrap">
          {{ customer.notes || 'Nenhuma observação cadastrada.' }}
        </p>
      </div>
    </template>
  </div>
</template>
