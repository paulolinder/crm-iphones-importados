<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const osId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Editar OS' })

const notifyFormPlaceholder = usePlaceholderSubmit()
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
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Status" />
        <AdminFieldStub label="Previsão de entrega" type="date" />
        <AdminFieldStub label="Valor orçado (R$)" />
        <AdminFieldStub label="Observações internas" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
        @click="notifyFormPlaceholder"
      >
        Salvar (placeholder)
      </button>
    </div>
  </div>
</template>
