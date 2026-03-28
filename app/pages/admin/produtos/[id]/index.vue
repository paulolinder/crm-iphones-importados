<script setup lang="ts">
import type { Product } from '~~/domains/produtos/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const productId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const { format } = useCurrency()
const service = useProductsService()
const product = ref<Product | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const load = async () => {
  if (!productId.value) {
    return
  }

  loading.value = true
  loadError.value = null

  try {
    product.value = await service.getById(productId.value)
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Produto não encontrado'
    product.value = null
  }
  finally {
    loading.value = false
  }
}

watch(productId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() => product.value?.name ? `${product.value.name} — Produto` : 'Produto'),
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes do produto"
      :description="product?.name || 'Carregando…'"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: product?.name || 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/produtos/${productId}/editar` },
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/produtos' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando produto…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ loadError }}
    </div>
    <template v-else-if="product">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:col-span-2">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            SKU / código
          </p>
          <p class="mt-2 text-sm font-mono text-slate-900">
            {{ product.sku || '—' }}
          </p>
          <p class="mt-4 text-xs font-semibold text-slate-500 uppercase">
            Categoria / marca
          </p>
          <p class="mt-1 text-sm text-slate-700">
            {{ product.category?.name || '—' }} · {{ product.brand?.name || '—' }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Preço venda
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ format(product.price) }}
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-slate-500 uppercase">
            Estoque
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ product.stock_quantity }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            Mín: {{ product.min_stock }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">
          Descrição
        </h3>
        <p class="text-sm text-slate-600 whitespace-pre-wrap">
          {{ product.description || 'Sem descrição.' }}
        </p>
      </div>
    </template>
  </div>
</template>
