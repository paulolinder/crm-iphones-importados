<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova garantia' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova garantia"
      description="Vincule garantia a pedido ou aparelho (IMEI)"
      :breadcrumbs="[
        { label: 'Garantias', to: '/admin/garantias' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/garantias' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Pedido / OS" hint="Número ou busca" />
        <AdminFieldStub label="Produto" />
        <AdminFieldStub label="IMEI (se aplicável)" />
        <AdminFieldStub label="Duração (meses)" hint="12" />
        <AdminFieldStub label="Início" type="date" />
        <AdminFieldStub label="Observações" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
        @click="notifyFormPlaceholder"
      >
        Registrar garantia (placeholder)
      </button>
    </div>
  </div>
</template>
