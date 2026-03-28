<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova categoria' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova categoria"
      description="Cadastro rápido de categoria do catálogo"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Categorias', to: '/admin/produtos/categorias' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/produtos/categorias' },
      ]"
    />
    <AdminPlaceholderNotice description="Persistência via service de catálogo será ligada ao Supabase em seguida." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome" hint="Ex.: iPhones" />
        <AdminFieldStub label="Slug" hint="iphones" />
        <AdminFieldStub label="Descrição" hint="Texto curto para listagens" />
        <AdminFieldStub label="Ordem" hint="0" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
        @click="notifyFormPlaceholder"
      >
        Salvar (placeholder)
      </button>
    </div>
  </div>
</template>
