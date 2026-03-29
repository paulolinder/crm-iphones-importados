<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Impostos — Configurações' })

const settings = useAppSettingsService()
const { success, error: toastError } = useToast()

const KEY = 'config.impostos'

const form = reactive({
  regime: 'Simples Nacional',
  default_rate: 0,
  default_cfop: '5102',
  notes: '',
})
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const raw = await settings.getByKey(KEY)
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>
      form.regime = String(o.regime ?? 'Simples Nacional')
      form.default_rate = Number(o.default_rate ?? 0)
      form.default_cfop = String(o.default_cfop ?? '5102')
      form.notes = String(o.notes ?? '')
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
    await settings.saveByKey(KEY, { ...form }, 'Impostos')
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
      title="Impostos"
      description="Alíquotas e regime (app_settings)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Impostos' },
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
        <label class="form-label">Regime</label>
        <input v-model="form.regime" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Alíquota padrão (%)</label>
        <input v-model.number="form.default_rate" type="number" step="0.01" class="form-input">
      </div>
      <div>
        <label class="form-label">CFOP padrão (venda)</label>
        <input v-model="form.default_cfop" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Observações fiscais</label>
        <textarea v-model="form.notes" rows="3" class="form-input" />
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
