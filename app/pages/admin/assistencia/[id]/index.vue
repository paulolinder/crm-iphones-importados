<script setup lang="ts">
import { SERVICE_STATUS_CONFIG } from '~/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const osId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const svc = useTechnicalAssistanceService()
const row = ref<Awaited<ReturnType<typeof svc.getById>>>(null)
const loading = ref(true)
const err = ref<string | null>(null)

const load = async () => {
  if (!osId.value) {
    return
  }
  loading.value = true
  err.value = null
  try {
    row.value = await svc.getById(osId.value)
    if (!row.value) {
      err.value = 'OS não encontrada'
    }
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro'
    row.value = null
  }
  finally {
    loading.value = false
  }
}

watch(osId, () => {
  void load()
}, { immediate: true })

useHead({ title: 'Ordem de serviço' })

const statusLabel = computed(() => {
  const s = row.value?.status
  if (!s) {
    return ''
  }
  return SERVICE_STATUS_CONFIG[s as keyof typeof SERVICE_STATUS_CONFIG]?.label ?? s
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Ordem de serviço"
      :description="row?.order_number || `OS #${osId}`"
      :breadcrumbs="[
        { label: 'Assistência', to: '/admin/assistencia' },
        { label: `OS ${osId}` },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/assistencia/${osId}/editar` },
        { key: 'back', label: 'Lista', variant: 'outline', to: '/admin/assistencia' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else-if="row" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div class="flex flex-wrap gap-2">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">{{ statusLabel }}</span>
      </div>
      <div>
        <p class="text-xs text-slate-500">
          Cliente
        </p>
        <p class="text-sm font-medium">
          {{ (row as { customers?: { name?: string } | null }).customers?.name || '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs text-slate-500">
          Defeito
        </p>
        <p class="text-sm text-slate-800 whitespace-pre-wrap">
          {{ row.issue_description }}
        </p>
      </div>
      <div v-if="row.diagnosis">
        <p class="text-xs text-slate-500">
          Diagnóstico
        </p>
        <p class="text-sm text-slate-700 whitespace-pre-wrap">
          {{ row.diagnosis }}
        </p>
      </div>
      <div v-if="row.solution">
        <p class="text-xs text-slate-500">
          Solução
        </p>
        <p class="text-sm text-slate-700 whitespace-pre-wrap">
          {{ row.solution }}
        </p>
      </div>
    </div>
  </div>
</template>
