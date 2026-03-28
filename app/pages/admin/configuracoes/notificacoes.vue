<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Notificações — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Notificações"
      description="Alertas de estoque, vendas e sistema"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Notificações' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar preferências', icon: 'lucide:save', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      <div
        v-for="row in [
          { t: 'Estoque baixo', d: 'E-mail quando SKU abaixo do mínimo' },
          { t: 'Nova venda', d: 'Push interno ao confirmar pedido' },
          { t: 'Backup', d: 'Lembrete semanal de exportação' },
        ]"
        :key="row.t"
        class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <p class="text-sm font-medium text-slate-900">{{ row.t }}</p>
          <p class="text-xs text-slate-500">{{ row.d }}</p>
        </div>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600"
        >
          Em breve
        </button>
      </div>
    </div>
  </div>
</template>
