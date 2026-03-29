<script setup lang="ts">
import type { ProductCostBreakdownInput } from '~~/domains/produtos/cost-breakdown'
import type { ProductFormData } from '~~/domains/produtos/types'
import { computeTotalCost } from '~~/domains/produtos/cost-breakdown'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Editar Produto',
})

const route = useRoute()
const productId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : String(route.params.id ?? ''))
const { success, error: showError } = useToast()
const service = useProductsService()
const { uploadProductImage } = useProductImageUpload()

const productImageUrl = ref('')
const productImageFile = ref<File | null>(null)
const productImageDirty = ref(false)
const categories = ref<{ id: string, name: string }[]>([])
const brands = ref<{ id: string, name: string }[]>([])

const costBreakdown = ref<ProductCostBreakdownInput>({})

const form = reactive({
  name: '',
  sku: '',
  category_id: '',
  brand_id: '',
  price: 0,
  stock_quantity: 0,
  min_stock: 0,
  max_stock: 0,
  status: 'active' as 'draft' | 'active' | 'inactive' | 'archived',
  description: '',
  is_trackable: false,
})

const loading = ref(true)
const saving = ref(false)
const submitError = ref('')

function onBrandCreated(brand: { id: string; name: string }) {
  brands.value = [...brands.value, brand].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  )
}

onMounted(async () => {
  try {
    const [categoryRows, brandRows, product] = await Promise.all([
      service.listCategories(),
      service.listBrands(),
      service.getById(productId.value),
    ])

    categories.value = categoryRows.map(category => ({ id: category.id, name: category.name }))
    brands.value = brandRows.map(brand => ({ id: brand.id, name: brand.name }))

    form.name = product.name
    form.sku = product.sku ?? ''
    form.category_id = product.category_id ?? ''
    form.brand_id = product.brand_id ?? ''
    form.price = product.price
    costBreakdown.value = product.cost_breakdown
      ? { ...product.cost_breakdown }
      : (product.cost != null && product.cost > 0 ? { base_cost_brl: product.cost } : {})
    form.stock_quantity = product.stock_quantity
    form.min_stock = product.min_stock
    form.max_stock = product.max_stock ?? 0
    form.status = product.status
    form.description = product.description ?? ''
    form.is_trackable = product.is_trackable ?? false
    productImageUrl.value = product.images[0] ?? ''
    productImageFile.value = null
    productImageDirty.value = false
  }
  catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Não foi possível carregar o produto.'
  }
  finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  submitError.value = ''
  saving.value = true

  try {
    const totalCost = computeTotalCost(costBreakdown.value)

    const patch: Partial<ProductFormData> = {
      name: form.name,
      sku: form.sku,
      category_id: form.category_id || undefined,
      brand_id: form.brand_id || undefined,
      price: form.price,
      cost: totalCost,
      cost_breakdown: { ...costBreakdown.value },
      stock_quantity: form.stock_quantity,
      min_stock: form.min_stock,
      max_stock: form.max_stock || undefined,
      status: form.status,
      description: form.description,
      is_trackable: form.is_trackable,
    }

    if (productImageDirty.value) {
      if (productImageFile.value) {
        patch.images = [await uploadProductImage(productImageFile.value)]
      }
      else if (productImageUrl.value.trim()) {
        patch.images = [productImageUrl.value.trim()]
      }
      else {
        patch.images = []
      }
    }

    await service.update(productId.value, patch)

    success('Produto atualizado', 'As alterações foram salvas com sucesso.')
    await navigateTo('/admin/produtos')
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível atualizar o produto.'
    submitError.value = message
    showError('Erro ao atualizar produto', message)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar Produto"
      description="Atualize os dados do catálogo"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Editar produto' },
      ]"
    />

    <div class="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div v-if="loading" class="py-10 text-center text-sm text-slate-500">Carregando produto...</div>

      <form v-else class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">Nome</label>
            <input v-model="form.name" class="form-input" placeholder="Nome do produto" />
          </div>

          <div>
            <label class="form-label">SKU</label>
            <input v-model="form.sku" class="form-input" placeholder="SKU interno" />
          </div>

          <div>
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-input">
              <option value="draft">Rascunho</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div>
            <label class="form-label">Categoria</label>
            <select v-model="form.category_id" class="form-input">
              <option value="">Selecione</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>

          <AdminBrandField
            v-model="form.brand_id"
            :brands="brands"
            @brand-created="onBrandCreated"
          />

          <AdminProductImageField
            v-model:url="productImageUrl"
            v-model:file="productImageFile"
            @interacted="productImageDirty = true"
          />

          <div>
            <label class="form-label">Preço de venda</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="form-input" />
          </div>

          <ProductCostSection v-model="costBreakdown" :price="form.price" />

          <div>
            <label class="form-label">Quantidade em estoque</label>
            <input
              v-model.number="form.stock_quantity"
              type="number"
              min="0"
              step="1"
              class="form-input"
            >
            <p class="text-xs text-slate-500 mt-1">
              Ajuste direto do saldo. Para histórico formal, use movimentações de estoque.
            </p>
          </div>

          <div>
            <label class="form-label">Estoque mínimo</label>
            <input v-model.number="form.min_stock" type="number" min="0" class="form-input" />
          </div>

          <div>
            <label class="form-label">Estoque máximo</label>
            <input v-model.number="form.max_stock" type="number" min="0" class="form-input" />
          </div>
        </div>

        <label class="flex items-center gap-3">
          <input v-model="form.is_trackable" type="checkbox" class="form-checkbox" />
          <span class="text-sm text-slate-600">Controlar individualmente por IMEI/serial</span>
        </label>

        <div>
          <label class="form-label">Descrição</label>
          <textarea v-model="form.description" class="form-input min-h-32" placeholder="Descrição interna do produto" />
        </div>

        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

        <div class="flex items-center justify-end gap-3">
          <NuxtLink to="/admin/produtos" class="btn-outline">Cancelar</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
