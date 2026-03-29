<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supplierId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const svc = useSuppliersService()
const row = ref<Awaited<ReturnType<typeof svc.getById>>>(null)
const loading = ref(true)
const err = ref<string | null>(null)

const load = async () => {
  if (!supplierId.value) {
    return
  }
  loading.value = true
  err.value = null
  try {
    row.value = await svc.getById(supplierId.value)
    if (!row.value) {
      err.value = 'Fornecedor não encontrado'
    }
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro ao carregar'
    row.value = null
  }
  finally {
    loading.value = false
  }
}

watch(supplierId, () => {
  void load()
}, { immediate: true })

useHead({ title: computed(() => row.value?.name || 'Fornecedor') })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes do fornecedor"
      :description="row?.name || 'Carregando…'"
      :breadcrumbs="[
        { label: 'Fornecedores', to: '/admin/fornecedores' },
        { label: 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/fornecedores/${supplierId}/editar` },
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/fornecedores' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else-if="row" class="grid gap-4 md:grid-cols-3">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:col-span-2 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Dados cadastrais
        </h3>
        <div>
          <p class="text-xs text-slate-500">
            Nome
          </p>
          <p class="text-sm font-medium text-slate-900">
            {{ row.name }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Documento
          </p>
          <p class="text-sm text-slate-800">
            {{ row.document || '—' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Status
          </p>
          <p class="text-sm">
            {{ row.active ? 'Ativo' : 'Inativo' }}
          </p>
        </div>
        <div v-if="row.notes">
          <p class="text-xs text-slate-500">
            Observações
          </p>
          <p class="text-sm text-slate-700 whitespace-pre-wrap">
            {{ row.notes }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Contato
        </h3>
        <div>
          <p class="text-xs text-slate-500">
            Nome do contato
          </p>
          <p class="text-sm text-slate-800">
            {{ row.contact_name || '—' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            E-mail
          </p>
          <p class="text-sm text-slate-800">
            {{ row.email || '—' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Telefone
          </p>
          <p class="text-sm text-slate-800">
            {{ row.phone || '—' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
