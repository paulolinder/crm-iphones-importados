<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Contas a pagar' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Contas a pagar"
      description="Fornecedores, despesas fixas e parcelas"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a pagar' },
      ]"
      :actions="[
        { key: 'new', label: 'Nova conta', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/contas-pagar/nova' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div class="text-sm text-slate-500 text-center py-10">
        Tabela de accounts_payable com filtros por vencimento e status.
      </div>
    </div>
  </div>
</template>
