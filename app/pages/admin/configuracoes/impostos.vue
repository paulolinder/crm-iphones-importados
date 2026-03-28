<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Impostos — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Impostos"
      description="Alíquotas e regime tributário simplificado"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Impostos' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar', icon: 'lucide:save', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Regime" hint="Simples Nacional" />
        <AdminFieldStub label="Alíquota padrão (%)" hint="0" />
        <AdminFieldStub label="CFOP padrão (venda)" hint="5102" />
        <AdminFieldStub label="Observações fiscais" hint="Texto para NF quando aplicável" />
      </AdminFormGrid>
    </div>
  </div>
</template>
