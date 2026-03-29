<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Pagamentos — Configurações' })

const settings = useAppSettingsService()
const { success, error: toastError } = useToast()

const KEY = 'config.pagamentos'

const form = reactive({
  default_method: 'pix',
  installment_max: 12,
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
      form.default_method = String(o.default_method ?? 'pix')
      form.installment_max = Number(o.installment_max ?? 12)
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
    await settings.saveByKey(KEY, { ...form }, 'Pagamentos')
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
      title="Pagamentos"
      description="Preferências de checkout (app_settings)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Pagamentos' },
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
        <label class="form-label">Método padrão sugerido</label>
        <select v-model="form.default_method" class="form-input">
          <option value="pix">
            PIX
          </option>
          <option value="credit_card">
            Cartão crédito
          </option>
          <option value="debit_card">
            Cartão débito
          </option>
          <option value="cash">
            Dinheiro
          </option>
        </select>
      </div>
      <div>
        <label class="form-label">Máx. parcelas (referência)</label>
        <input v-model.number="form.installment_max" type="number" min="1" max="24" class="form-input">
      </div>
      <div>
        <label class="form-label">Observações</label>
        <textarea v-model="form.notes" rows="2" class="form-input" />
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
