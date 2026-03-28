<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar clientes' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Exportar clientes"
      description="CSV com filtros opcionais"
      :breadcrumbs="[
        { label: 'Clientes', to: '/admin/clientes' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/clientes' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <AdminFormGrid>
        <AdminFieldStub label="Status" hint="Todos · ativo · lead…" />
        <AdminFieldStub label="Incluir endereços" hint="Sim / Não" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      >
        Gerar CSV (placeholder)
      </button>
    </div>
  </div>
</template>
