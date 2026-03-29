<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const warrantyId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const svc = useWarrantiesService()
const row = ref<Awaited<ReturnType<typeof svc.getById>>>(null)
const loading = ref(true)
const err = ref<string | null>(null)

const load = async () => {
  if (!warrantyId.value) {
    return
  }
  loading.value = true
  err.value = null
  try {
    row.value = await svc.getById(warrantyId.value)
    if (!row.value) {
      err.value = 'Garantia não encontrada'
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

watch(warrantyId, () => {
  void load()
}, { immediate: true })

useHead({ title: 'Garantia' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes da garantia"
      :description="`ID: ${warrantyId}`"
      :breadcrumbs="[
        { label: 'Garantias', to: '/admin/garantias' },
        { label: 'Detalhes' },
      ]"
      :actions="[
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/garantias' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else-if="row" class="grid gap-4 md:grid-cols-2">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Cliente
        </h3>
        <p class="text-sm text-slate-800">
          {{ (row as { customers?: { name?: string } | null }).customers?.name || '—' }}
        </p>
        <p class="text-xs text-slate-500 font-mono">
          {{ row.customer_id || 'sem cliente' }}
        </p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Validade
        </h3>
        <p class="text-sm capitalize">
          Status: {{ row.status }}
        </p>
        <p class="text-sm">
          Início: {{ row.warranty_start?.slice(0, 10) || '—' }}
        </p>
        <p class="text-sm">
          Término: {{ row.warranty_end?.slice(0, 10) || '—' }}
        </p>
      </div>
      <div v-if="row.notes" class="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">
          Observações
        </h3>
        <p class="text-sm text-slate-700 whitespace-pre-wrap">
          {{ row.notes }}
        </p>
      </div>
    </div>
  </div>
</template>
