<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar financeiro' })

const { info: toastInfo } = useToast()

function onExportClick() {
  toastInfo('Exportação em desenvolvimento', 'Planilhas de lançamentos e contas serão geradas em breve.')
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Exportar dados financeiros"
      description="Planilhas de lançamentos, contas a pagar e receber"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/financeiro' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <AdminFormGrid>
        <AdminFieldStub label="Escopo" hint="Lançamentos · Contas a pagar · Contas a receber" />
        <AdminFieldStub label="Formato" hint="CSV" />
        <AdminFieldStub label="Competência" type="month" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
        @click="onExportClick"
      >
        Gerar exportação (placeholder)
      </button>
    </div>
  </div>
</template>
