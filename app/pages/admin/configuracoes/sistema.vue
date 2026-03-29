<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Sistema — Configurações' })

const settings = useAppSettingsService()
const { success, error: toastError } = useToast()

const KEY = 'config.sistema'

const form = reactive({
  timezone: 'America/Sao_Paulo',
  date_format: 'DD/MM/YYYY',
  maintenance: false,
})
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const raw = await settings.getByKey(KEY)
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>
      form.timezone = String(o.timezone ?? 'America/Sao_Paulo')
      form.date_format = String(o.date_format ?? 'DD/MM/YYYY')
      form.maintenance = Boolean(o.maintenance)
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
    await settings.saveByKey(KEY, { ...form }, 'Sistema')
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
      title="Sistema"
      description="Preferências gerais (app_settings)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Sistema' },
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
        <label class="form-label">Fuso horário</label>
        <input v-model="form.timezone" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Formato de data (referência)</label>
        <input v-model="form.date_format" type="text" class="form-input">
      </div>
      <label class="inline-flex items-center gap-2">
        <input v-model="form.maintenance" type="checkbox" class="rounded border-slate-300">
        <span class="text-sm text-slate-700">Modo manutenção (apenas lembrete interno)</span>
      </label>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
