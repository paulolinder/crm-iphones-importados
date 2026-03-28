<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Editar categoria' })

const route = useRoute()
const categoryId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar categoria"
      :description="`Identificador: ${categoryId}`"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Categorias', to: '/admin/produtos/categorias' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/produtos/categorias' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome" />
        <AdminFieldStub label="Slug" />
        <AdminFieldStub label="Descrição" />
        <AdminFieldStub label="Ordem" hint="0" />
      </AdminFormGrid>
    </div>
  </div>
</template>
