<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Contas a receber' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Contas a receber"
      description="Parcelas de vendas e recebíveis"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a receber' },
      ]"
      :actions="[
        { key: 'new', label: 'Novo recebível', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/contas-receber/nova' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="text-sm text-slate-500 text-center py-10">
        Integração com accounts_receivable e vínculo opcional com orders.
      </div>
    </div>
  </div>
</template>
