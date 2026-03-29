<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar categoria' })

const route = useRoute()
const categoryId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const products = useProductsService()
const { success, error: toastError } = useToast()

const allCategories = ref<Awaited<ReturnType<typeof products.listCategories>>>([])
const form = reactive({
  name: '',
  description: '',
  parent_id: '' as string,
  sort_order: 0,
  active: true,
})
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  if (!categoryId.value) {
    return
  }
  loading.value = true
  try {
    const [c, list] = await Promise.all([
      products.getCategoryById(categoryId.value),
      products.listCategories(),
    ])
    allCategories.value = list.filter(x => x.id !== categoryId.value)
    if (c) {
      form.name = c.name
      form.description = c.description ?? ''
      form.parent_id = c.parent_id ?? ''
      form.sort_order = c.sort_order ?? 0
      form.active = c.active
    }
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

watch(categoryId, () => {
  void load()
}, { immediate: true })

const submit = async () => {
  if (!form.name.trim()) {
    toastError('Validação', 'Informe o nome.')
    return
  }
  saving.value = true
  try {
    await products.updateCategory(categoryId.value, {
      name: form.name.trim(),
      description: form.description.trim() || null,
      parent_id: form.parent_id || null,
      sort_order: form.sort_order,
      active: form.active,
    })
    success('Salvo', '')
    await navigateTo('/admin/produtos/categorias')
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Não foi possível salvar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar categoria"
      :description="`Identificador: ${categoryId}`"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Categorias', to: '/admin/produtos/categorias' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/produtos/categorias' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div>
        <label class="form-label">Nome *</label>
        <input v-model="form.name" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Descrição</label>
        <textarea v-model="form.description" rows="3" class="form-input" />
      </div>
      <div>
        <label class="form-label">Categoria pai</label>
        <select v-model="form.parent_id" class="form-input">
          <option value="">
            Nenhuma
          </option>
          <option v-for="c in allCategories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.sort_order" type="number" class="form-input">
      </div>
      <div class="flex items-center gap-2">
        <input id="cactive" v-model="form.active" type="checkbox" class="rounded border-slate-300">
        <label for="cactive" class="text-sm text-slate-700">Ativa</label>
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
