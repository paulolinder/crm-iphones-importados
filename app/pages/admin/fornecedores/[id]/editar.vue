<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const supplierId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Editar fornecedor' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar fornecedor"
      :description="`ID: ${supplierId}`"
      :breadcrumbs="[
        { label: 'Fornecedores', to: '/admin/fornecedores' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'view', label: 'Ver detalhes', variant: 'outline', to: `/admin/fornecedores/${supplierId}` },
        { key: 'cancel', label: 'Cancelar', variant: 'ghost', to: '/admin/fornecedores' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Razão social / nome" />
        <AdminFieldStub label="Documento" />
        <AdminFieldStub label="E-mail" />
        <AdminFieldStub label="Telefone" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
      >
        Salvar alterações (placeholder)
      </button>
    </div>
  </div>
</template>
