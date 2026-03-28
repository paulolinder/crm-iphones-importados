<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova conta a receber' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova conta a receber"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a receber', to: '/admin/financeiro/contas-receber' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'back', label: 'Cancelar', variant: 'outline', to: '/admin/financeiro/contas-receber' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Cliente" />
        <AdminFieldStub label="Pedido (opcional)" />
        <AdminFieldStub label="Valor (R$)" />
        <AdminFieldStub label="Vencimento" type="date" />
      </AdminFormGrid>
    </div>
  </div>
</template>
