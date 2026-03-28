<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar vendas' })

const { info: toastInfo } = useToast()

function onExportClick() {
  toastInfo('Exportação em desenvolvimento', 'Arquivo de vendas filtradas será gerado em breve.')
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Exportar vendas"
      description="CSV ou planilha com pedidos filtrados"
      :breadcrumbs="[
        { label: 'Vendas', to: '/admin/vendas' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/vendas' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <AdminFormGrid>
        <AdminFieldStub label="Período inicial" type="date" />
        <AdminFieldStub label="Período final" type="date" />
        <AdminFieldStub label="Formato" hint="CSV · XLSX" />
        <AdminFieldStub label="Incluir itens" hint="Sim / Não" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
        @click="onExportClick"
      >
        Gerar arquivo (placeholder)
      </button>
    </div>
  </div>
</template>
