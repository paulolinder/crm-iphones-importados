<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova categoria' })

const products = useProductsService()
const { success, error: toastError } = useToast()

const categories = ref<Awaited<ReturnType<typeof products.listCategories>>>([])
const form = reactive({
  name: '',
  description: '',
  parent_id: '' as string,
})
const saving = ref(false)

onMounted(async () => {
  try {
    categories.value = await products.listCategories()
  }
  catch {
    categories.value = []
  }
})

const submit = async () => {
  if (!form.name.trim()) {
    toastError('Validação', 'Informe o nome da categoria.')
    return
  }
  saving.value = true
  try {
    await products.createCategory({
      name: form.name.trim(),
      description: form.description.trim() || null,
      parent_id: form.parent_id || null,
    })
    success('Categoria criada', '')
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
      title="Nova categoria"
      description="Cadastro na tabela categories"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Categorias', to: '/admin/produtos/categorias' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/produtos/categorias' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div>
        <label class="form-label">Nome *</label>
        <input v-model="form.name" type="text" class="form-input" placeholder="Ex.: Smartphones">
      </div>
      <div>
        <label class="form-label">Descrição</label>
        <textarea v-model="form.description" rows="3" class="form-input" />
      </div>
      <div>
        <label class="form-label">Categoria pai (opcional)</label>
        <select v-model="form.parent_id" class="form-input">
          <option value="">
            Nenhuma
          </option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar categoria' }}
      </button>
    </div>
  </div>
</template>
