<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova marca' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova marca"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Marcas', to: '/admin/produtos/marcas' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/produtos/marcas' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome" hint="Apple" />
        <AdminFieldStub label="Slug" hint="apple" />
        <AdminFieldStub label="URL do logo" hint="https://..." />
        <AdminFieldStub label="Descrição" />
      </AdminFormGrid>
    </div>
  </div>
</template>
