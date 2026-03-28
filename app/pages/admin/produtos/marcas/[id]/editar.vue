<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar marca' })

const route = useRoute()
const brandId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar marca"
      :description="`ID: ${brandId}`"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Marcas', to: '/admin/produtos/marcas' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/produtos/marcas' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome" />
        <AdminFieldStub label="Slug" />
        <AdminFieldStub label="URL do logo" />
      </AdminFormGrid>
    </div>
  </div>
</template>
