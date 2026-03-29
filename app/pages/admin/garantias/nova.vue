<script setup lang="ts">
import type { Tables } from '~/lib/supabase/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova garantia' })

const warranties = useWarrantiesService()
const customersSvc = useCustomersService()
const { success, error: toastError } = useToast()

const customerOptions = ref<{ id: string; name: string }[]>([])
const form = reactive({
  customer_id: '',
  warranty_start: '',
  warranty_end: '',
  status: 'valid' as Tables<'warranties'>['status'],
  notes: '',
})
const saving = ref(false)

onMounted(async () => {
  try {
    const res = await customersSvc.list({ page: 1, per_page: 300 })
    customerOptions.value = res.data.map(c => ({ id: c.id, name: c.name }))
  }
  catch {
    customerOptions.value = []
  }
})

const statusOpts: { value: Tables<'warranties'>['status']; label: string }[] = [
  { value: 'valid', label: 'Válida' },
  { value: 'expiring', label: 'Expirando' },
  { value: 'expired', label: 'Expirada' },
  { value: 'claimed', label: 'Acionada' },
  { value: 'void', label: 'Anulada' },
]

const submit = async () => {
  saving.value = true
  try {
    const w = await warranties.create({
      customer_id: form.customer_id || null,
      warranty_start: form.warranty_start || null,
      warranty_end: form.warranty_end || null,
      status: form.status,
      notes: form.notes.trim() || null,
    })
    success('Garantia registrada', '')
    await navigateTo(`/admin/garantias/${w.id}`)
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao salvar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova garantia"
      description="Tabela warranties"
      :breadcrumbs="[
        { label: 'Garantias', to: '/admin/garantias' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/garantias' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label class="form-label">Cliente (opcional)</label>
        <select v-model="form.customer_id" class="form-input">
          <option value="">
            — Nenhum —
          </option>
          <option v-for="c in customerOptions" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">Início</label>
          <input v-model="form.warranty_start" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">Término</label>
          <input v-model="form.warranty_end" type="date" class="form-input">
        </div>
      </div>
      <div>
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-input">
          <option v-for="s in statusOpts" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="form-label">Observações</label>
        <textarea v-model="form.notes" rows="3" class="form-input" />
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Registrar garantia' }}
      </button>
    </div>
  </div>
</template>
