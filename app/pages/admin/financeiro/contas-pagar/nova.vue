<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova conta a pagar' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova conta a pagar"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a pagar', to: '/admin/financeiro/contas-pagar' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'back', label: 'Cancelar', variant: 'outline', to: '/admin/financeiro/contas-pagar' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Fornecedor" />
        <AdminFieldStub label="Valor (R$)" />
        <AdminFieldStub label="Vencimento" type="date" />
        <AdminFieldStub label="Descrição" />
      </AdminFormGrid>
    </div>
  </div>
</template>
