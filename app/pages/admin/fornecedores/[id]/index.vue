<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supplierId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Fornecedor' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes do fornecedor"
      :description="`ID: ${supplierId}`"
      :breadcrumbs="[
        { label: 'Fornecedores', to: '/admin/fornecedores' },
        { label: 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/fornecedores/${supplierId}/editar` },
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/fornecedores' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="grid gap-4 md:grid-cols-3">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:col-span-2 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Dados cadastrais
        </h3>
        <AdminFieldStub label="Nome" />
        <AdminFieldStub label="Documento" />
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Contato
        </h3>
        <AdminFieldStub label="E-mail" />
        <AdminFieldStub label="Telefone" />
      </div>
    </div>
  </div>
</template>
