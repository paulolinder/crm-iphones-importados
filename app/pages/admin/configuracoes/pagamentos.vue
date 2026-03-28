<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Pagamentos — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Formas de pagamento"
      description="PIX, cartão, parcelamento e taxas"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Pagamentos' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar', icon: 'lucide:save', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div class="flex items-center justify-between py-3 border-b border-slate-50">
        <span class="text-sm font-medium text-slate-800">PIX</span>
        <span class="text-xs text-emerald-600 font-medium">Ativo</span>
      </div>
      <div class="flex items-center justify-between py-3 border-b border-slate-50">
        <span class="text-sm font-medium text-slate-800">Cartão de crédito</span>
        <span class="text-xs text-slate-500">Placeholder</span>
      </div>
      <AdminFormGrid>
        <AdminFieldStub label="Taxa cartão (%)" hint="0,00" />
        <AdminFieldStub label="Parcelas máximas" hint="12" />
      </AdminFormGrid>
    </div>
  </div>
</template>
