<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Ajustes de estoque' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Ajustes de inventário"
      description="Correções de saldo, perdas e conferências"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Ajustes' },
      ]"
      :actions="[
        { key: 'mov', label: 'Histórico', variant: 'outline', to: '/admin/estoque/movimentacoes' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Produto (busca)" hint="SKU ou nome" />
        <AdminFieldStub label="Quantidade ajustada" hint="+/- unidades" />
        <AdminFieldStub label="Motivo" hint="Inventário, quebra, etc." />
        <AdminFieldStub label="Responsável" hint="Nome do usuário" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
        @click="notifyFormPlaceholder"
      >
        Registrar ajuste (placeholder)
      </button>
    </div>
  </div>
</template>
