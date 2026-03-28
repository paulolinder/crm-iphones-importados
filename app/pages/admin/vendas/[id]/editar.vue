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

useHead({ title: 'Editar pedido' })

const breadcrumbs = computed(() => [
  { label: 'Vendas', to: '/admin/vendas' },
  { label: order.value?.number || 'Pedido', to: `/admin/vendas/${orderId.value}` },
  { label: 'Editar' },
])

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar pedido"
      :description="order?.number || 'Carregando…'"
      :breadcrumbs="breadcrumbs"
      :actions="[
        { key: 'view', label: 'Ver detalhes', variant: 'outline', to: `/admin/vendas/${orderId}` },
        { key: 'back', label: 'Lista', variant: 'ghost', to: '/admin/vendas' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
    </div>
    <template v-else-if="order">
      <AdminPlaceholderNotice description="Alteração de status, pagamentos e itens será consolidada nas actions updateStatus e registerPayment do service de vendas." />
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <AdminFormGrid>
          <AdminFieldStub label="Status do pedido" :hint="order.status" />
          <AdminFieldStub label="Status pagamento" :hint="order.payment_status" />
          <AdminFieldStub label="Frete (R$)" :hint="format(order.shipping)" />
          <AdminFieldStub label="Desconto global" :hint="format(order.discount)" />
        </AdminFormGrid>
        <p class="text-xs text-slate-500">
          Total atual: <span class="font-semibold text-slate-800">{{ format(order.total) }}</span>
        </p>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
          @click="notifyFormPlaceholder"
        >
          Aplicar alterações (placeholder)
        </button>
      </div>
    </template>
  </div>
</template>
