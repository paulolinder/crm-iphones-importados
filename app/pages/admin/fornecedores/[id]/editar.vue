<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supplierId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const svc = useSuppliersService()
const { success, error: toastError } = useToast()

const form = reactive({
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  document: '',
  notes: '',
  active: true,
})
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  if (!supplierId.value) {
    return
  }
  loading.value = true
  try {
    const s = await svc.getById(supplierId.value)
    if (s) {
      form.name = s.name
      form.contact_name = s.contact_name ?? ''
      form.email = s.email ?? ''
      form.phone = s.phone ?? ''
      form.document = s.document ?? ''
      form.notes = s.notes ?? ''
      form.active = s.active
    }
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

watch(supplierId, () => {
  void load()
}, { immediate: true })

useHead({ title: 'Editar fornecedor' })

const submit = async () => {
  if (!form.name.trim()) {
    toastError('Validação', 'Informe o nome.')
    return
  }
  saving.value = true
  try {
    await svc.update(supplierId.value, {
      name: form.name.trim(),
      contact_name: form.contact_name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      document: form.document.trim() || null,
      notes: form.notes.trim() || null,
      active: form.active,
    })
    success('Salvo', 'Fornecedor atualizado.')
    await navigateTo(`/admin/fornecedores/${supplierId.value}`)
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
      title="Editar fornecedor"
      :description="`ID: ${supplierId}`"
      :breadcrumbs="[
        { label: 'Fornecedores', to: '/admin/fornecedores' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'view', label: 'Ver detalhes', variant: 'outline', to: `/admin/fornecedores/${supplierId}` },
        { key: 'cancel', label: 'Cancelar', variant: 'ghost', to: '/admin/fornecedores' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-3xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="form-label">Razão social / nome *</label>
          <input v-model="form.name" type="text" class="form-input" required>
        </div>
        <div>
          <label class="form-label">Contato</label>
          <input v-model="form.contact_name" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">Documento</label>
          <input v-model="form.document" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">E-mail</label>
          <input v-model="form.email" type="email" class="form-input">
        </div>
        <div>
          <label class="form-label">Telefone</label>
          <input v-model="form.phone" type="text" class="form-input">
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Observações</label>
          <textarea v-model="form.notes" rows="3" class="form-input" />
        </div>
        <div class="md:col-span-2 flex items-center gap-2">
          <input id="active" v-model="form.active" type="checkbox" class="rounded border-slate-300">
          <label for="active" class="text-sm text-slate-700">Ativo</label>
        </div>
      </div>
      <button
        type="button"
        class="btn-primary"
        :disabled="saving"
        @click="submit"
      >
        {{ saving ? 'Salvando…' : 'Salvar alterações' }}
      </button>
    </div>
  </div>
</template>
