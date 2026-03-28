<script setup lang="ts">
import type { Order } from '~~/domains/vendas/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const orderId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const { format } = useCurrency()
const service = useOrdersService()
const order = ref<Order | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const load = async () => {
  if (!orderId.value) {
    return
  }

  loading.value = true
  loadError.value = null

  try {
    order.value = await service.getById(orderId.value)
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Pedido não encontrado'
    order.value = null
  }
  finally {
    loading.value = false
  }
}

watch(orderId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() => order.value?.number ? `Pedido ${order.value.number}` : 'Pedido'),
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes do pedido"
      :description="order ? `${order.number} · ${order.customer?.name || 'Cliente'}` : 'Carregando…'"
      :breadcrumbs="[
        { label: 'Vendas', to: '/admin/vendas' },
        { label: order?.number || 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/vendas/${orderId}/editar` },
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/vendas' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando pedido…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
    </div>
    <template v-else-if="order">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Total
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ format(order.total) }}
          </p>
          <p class="text-xs text-slate-500 mt-1 capitalize">
            {{ order.status }} · {{ order.payment_status }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Cliente
          </p>
          <p class="mt-2 text-sm font-medium text-slate-900">
            {{ order.customer?.name || '—' }}
          </p>
          <p class="text-xs text-slate-500">
            {{ order.customer?.email || order.customer?.phone || '' }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Vendedor
          </p>
          <p class="mt-2 text-sm text-slate-800">
            {{ order.seller?.name || '—' }}
          </p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-900">
            Itens
          </h3>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-50/80 text-left text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th class="px-6 py-3">
                Produto
              </th>
              <th class="px-6 py-3 text-right">
                Qtd
              </th>
              <th class="px-6 py-3 text-right">
                Unit.
              </th>
              <th class="px-6 py-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in order.items" :key="item.id">
              <td class="px-6 py-3">
                {{ item.product_name }}
              </td>
              <td class="px-6 py-3 text-right">
                {{ item.quantity }}
              </td>
              <td class="px-6 py-3 text-right">
                {{ format(item.unit_price) }}
              </td>
              <td class="px-6 py-3 text-right font-medium">
                {{ format(item.total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="order.notes" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">
          Observações
        </h3>
        <p class="text-sm text-slate-600 whitespace-pre-wrap">
          {{ order.notes }}
        </p>
      </div>
    </template>
  </div>
</template>
