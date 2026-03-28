<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Saída de estoque' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Saída de estoque"
      description="Baixa manual, transferência ou consumo interno"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Saída' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/estoque' },
      ]"
    />
    <AdminPlaceholderNotice description="Será integrado ao service de inventário com validação de saldo e rastreio de IMEI quando aplicável." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Produto" hint="Buscar por SKU" />
        <AdminFieldStub label="Quantidade" hint="1" />
        <AdminFieldStub label="Tipo de saída" hint="venda_manual | perda | transferência" />
        <AdminFieldStub label="Observações" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
        @click="notifyFormPlaceholder"
      >
        Confirmar saída (placeholder)
      </button>
    </div>
  </div>
</template>
