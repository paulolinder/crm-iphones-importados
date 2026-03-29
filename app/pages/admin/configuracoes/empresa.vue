<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Empresa — Configurações' })

const settings = useAppSettingsService()
const { success, error: toastError } = useToast()

const KEY = 'config.empresa'

const form = reactive({
  legal_name: '',
  trade_name: '',
  document: '',
  phone: '',
  email: '',
})
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const raw = await settings.getByKey(KEY)
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>
      form.legal_name = String(o.legal_name ?? '')
      form.trade_name = String(o.trade_name ?? '')
      form.document = String(o.document ?? '')
      form.phone = String(o.phone ?? '')
      form.email = String(o.email ?? '')
    }
  }
  catch {
    /* */
  }
  finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await settings.saveByKey(KEY, { ...form }, 'Dados da empresa')
    success('Salvo', '')
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Empresa"
      description="Dados cadastrais (app_settings)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Empresa' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar', icon: 'lucide:save', variant: 'primary', onClick: save },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label class="form-label">Razão social</label>
        <input v-model="form.legal_name" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Nome fantasia</label>
        <input v-model="form.trade_name" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">CNPJ</label>
        <input v-model="form.document" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Telefone</label>
        <input v-model="form.phone" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">E-mail institucional</label>
        <input v-model="form.email" type="email" class="form-input">
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
