<script setup lang="ts">
import type { Tables } from '~/lib/supabase/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const osId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const svc = useTechnicalAssistanceService()
const { success, error: toastError } = useToast()

const loading = ref(true)
const saving = ref(false)
const form = reactive({
  status: 'pending' as Tables<'technical_assistance_orders'>['status'],
  diagnosis: '',
  solution: '',
  estimated_cost: null as number | null,
  final_cost: null as number | null,
})

const statusOpts: { value: Tables<'technical_assistance_orders'>['status']; label: string }[] = [
  { value: 'pending', label: 'Aguardando' },
  { value: 'diagnosing', label: 'Diagnóstico' },
  { value: 'waiting_parts', label: 'Aguardando peças' },
  { value: 'in_repair', label: 'Em reparo' },
  { value: 'ready', label: 'Pronto' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

const load = async () => {
  if (!osId.value) {
    return
  }
  loading.value = true
  try {
    const o = await svc.getById(osId.value)
    if (o) {
      form.status = o.status
      form.diagnosis = o.diagnosis ?? ''
      form.solution = o.solution ?? ''
      form.estimated_cost = o.estimated_cost
      form.final_cost = o.final_cost
    }
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

watch(osId, () => {
  void load()
}, { immediate: true })

useHead({ title: 'Editar OS' })

const submit = async () => {
  saving.value = true
  try {
    await svc.update(osId.value, {
      status: form.status,
      diagnosis: form.diagnosis.trim() || null,
      solution: form.solution.trim() || null,
      estimated_cost: form.estimated_cost,
      final_cost: form.final_cost,
    })
    success('Salvo', '')
    await navigateTo(`/admin/assistencia/${osId.value}`)
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
      title="Editar ordem de serviço"
      :description="`OS #${osId}`"
      :breadcrumbs="[
        { label: 'Assistência', to: '/admin/assistencia' },
        { label: `OS ${osId}`, to: `/admin/assistencia/${osId}` },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'view', label: 'Ver detalhes', variant: 'outline', to: `/admin/assistencia/${osId}` },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label class="form-label">Status</label>
        <select v-model="form.status" class="form-input">
          <option v-for="s in statusOpts" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="form-label">Diagnóstico</label>
        <textarea v-model="form.diagnosis" rows="3" class="form-input" />
      </div>
      <div>
        <label class="form-label">Solução</label>
        <textarea v-model="form.solution" rows="3" class="form-input" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">Custo estimado</label>
          <input v-model.number="form.estimated_cost" type="number" step="0.01" class="form-input">
        </div>
        <div>
          <label class="form-label">Custo final</label>
          <input v-model.number="form.final_cost" type="number" step="0.01" class="form-input">
        </div>
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
