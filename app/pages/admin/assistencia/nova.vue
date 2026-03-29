<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova OS — Assistência' })

const svc = useTechnicalAssistanceService()
const customersSvc = useCustomersService()
const { success, error: toastError } = useToast()

const customerOptions = ref<{ id: string; name: string }[]>([])
const form = reactive({
  customer_id: '',
  issue_description: '',
  diagnosis: '',
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

const submit = async () => {
  if (!form.customer_id) {
    toastError('Validação', 'Selecione o cliente.')
    return
  }
  if (!form.issue_description.trim()) {
    toastError('Validação', 'Descreva o defeito.')
    return
  }
  saving.value = true
  try {
    const os = await svc.create({
      customer_id: form.customer_id,
      issue_description: form.issue_description,
      diagnosis: form.diagnosis.trim() || undefined,
    })
    success('OS aberta', os.order_number)
    await navigateTo(`/admin/assistencia/${os.id}`)
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao abrir OS')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova ordem de serviço"
      description="technical_assistance_orders"
      :breadcrumbs="[
        { label: 'Assistência', to: '/admin/assistencia' },
        { label: 'Nova OS' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/assistencia' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label class="form-label">Cliente *</label>
        <select v-model="form.customer_id" class="form-input">
          <option disabled value="">
            Selecione…
          </option>
          <option v-for="c in customerOptions" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="form-label">Defeito relatado *</label>
        <textarea v-model="form.issue_description" rows="4" class="form-input" />
      </div>
      <div>
        <label class="form-label">Diagnóstico inicial (opcional)</label>
        <textarea v-model="form.diagnosis" rows="2" class="form-input" />
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Abrindo…' : 'Abrir OS' }}
      </button>
    </div>
  </div>
</template>
