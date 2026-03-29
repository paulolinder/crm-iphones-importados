<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar marca' })

const route = useRoute()
const brandId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const products = useProductsService()
const { success, error: toastError } = useToast()

const form = reactive({
  name: '',
  description: '',
  active: true,
})
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  if (!brandId.value) {
    return
  }
  loading.value = true
  try {
    const b = await products.getBrandById(brandId.value)
    if (b) {
      form.name = b.name
      form.description = b.description ?? ''
      form.active = b.active
    }
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

watch(brandId, () => {
  void load()
}, { immediate: true })

const submit = async () => {
  if (!form.name.trim()) {
    toastError('Validação', 'Informe o nome.')
    return
  }
  saving.value = true
  try {
    await products.updateBrand(brandId.value, {
      name: form.name.trim(),
      description: form.description.trim() || null,
      active: form.active,
    })
    success('Salvo', '')
    await navigateTo('/admin/produtos/marcas')
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
      title="Editar marca"
      :description="`ID: ${brandId}`"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Marcas', to: '/admin/produtos/marcas' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/produtos/marcas' },
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
      <div class="flex items-center gap-2">
        <input id="bactive" v-model="form.active" type="checkbox" class="rounded border-slate-300">
        <label for="bactive" class="text-sm text-slate-700">Ativa</label>
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
