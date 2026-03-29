<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova marca' })

const products = useProductsService()
const { success, error: toastError } = useToast()

const form = reactive({
  name: '',
  description: '',
})
const saving = ref(false)

const submit = async () => {
  if (!form.name.trim()) {
    toastError('Validação', 'Informe o nome da marca.')
    return
  }
  saving.value = true
  try {
    await products.createBrand({
      name: form.name.trim(),
      description: form.description.trim() || null,
    })
    success('Marca criada', '')
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
      title="Nova marca"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Marcas', to: '/admin/produtos/marcas' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/produtos/marcas' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div>
        <label class="form-label">Nome *</label>
        <input v-model="form.name" type="text" class="form-input" placeholder="Ex.: Apple">
      </div>
      <div>
        <label class="form-label">Descrição</label>
        <textarea v-model="form.description" rows="3" class="form-input" />
      </div>
      <p class="text-xs text-slate-500">
        O slug é gerado automaticamente a partir do nome.
      </p>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar marca' }}
      </button>
    </div>
  </div>
</template>
