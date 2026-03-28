<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Sistema — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Sistema"
      description="Versão, ambiente e opções globais da aplicação"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Sistema' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <AdminFormGrid>
        <AdminFieldStub label="Nome do app" hint="Eleve Imports CRM" />
        <AdminFieldStub label="Fuso horário" hint="America/Sao_Paulo" />
        <AdminFieldStub label="Moeda" hint="BRL" />
        <AdminFieldStub label="Versão (runtime)" hint="via NUXT_PUBLIC_APP_VERSION" />
      </AdminFormGrid>
    </div>
  </div>
</template>
