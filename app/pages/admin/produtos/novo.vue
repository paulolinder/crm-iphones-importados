<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Novo Produto',
})

const { success, error: showError } = useToast()
const service = useProductsService()
const categories = ref<{ id: string, name: string }[]>([])
const brands = ref<{ id: string, name: string }[]>([])

const form = reactive({
  name: '',
  sku: '',
  category_id: '',
  brand_id: '',
  price: 0,
  cost: 0,
  min_stock: 0,
  max_stock: 0,
  status: 'active' as 'draft' | 'active' | 'inactive' | 'archived',
  description: '',
  is_trackable: false,
})

const saving = ref(false)
const submitError = ref('')

onMounted(async () => {
  const [categoryRows, brandRows] = await Promise.all([
    service.listCategories(),
    service.listBrands(),
  ])

  categories.value = categoryRows.map(category => ({ id: category.id, name: category.name }))
  brands.value = brandRows.map(brand => ({ id: brand.id, name: brand.name }))
})

const handleSubmit = async () => {
  submitError.value = ''
  saving.value = true

  try {
    await service.create({
      name: form.name,
      sku: form.sku,
      category_id: form.category_id || undefined,
      brand_id: form.brand_id || undefined,
      price: form.price,
      cost: form.cost || undefined,
      min_stock: form.min_stock,
      max_stock: form.max_stock || undefined,
      status: form.status,
      description: form.description,
      is_trackable: form.is_trackable,
    })

    success('Produto criado', 'O produto foi salvo com sucesso.')
    await navigateTo('/admin/produtos')
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível criar o produto.'
    submitError.value = message
    showError('Erro ao criar produto', message)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo Produto"
      description="Cadastre um novo item no catálogo"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Novo produto' },
      ]"
    />

    <div class="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <form class="space-y-5" @submit.prevent="handleSubmit">
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

          <div>
            <label class="form-label">Marca</label>
            <select v-model="form.brand_id" class="form-input">
              <option value="">Selecione</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
            </select>
          </div>

          <div>
            <label class="form-label">Preço de venda</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="form-input" />
          </div>

          <div>
            <label class="form-label">Custo</label>
            <input v-model.number="form.cost" type="number" min="0" step="0.01" class="form-input" />
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
            {{ saving ? 'Salvando...' : 'Salvar produto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
