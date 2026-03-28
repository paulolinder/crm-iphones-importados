<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Integrações — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Integrações"
      description="APIs, webhooks e serviços externos"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Integrações' },
      ]"
    />
    <AdminPlaceholderNotice description="Chaves e URLs sensíveis devem ficar apenas em variáveis de ambiente no servidor." />
    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 class="font-semibold text-slate-900">
          Supabase
        </h3>
        <p class="text-sm text-slate-500">
          Projeto já conectado via `NUXT_PUBLIC_SUPABASE_*`.
        </p>
        <AdminFieldStub label="Webhook (futuro)" hint="https://..." />
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 class="font-semibold text-slate-900">
          Outros
        </h3>
        <AdminFieldStub label="Nome da integração" hint="Ex.: ERP" />
        <AdminFieldStub label="Endpoint" hint="https://api..." />
      </div>
    </div>
  </div>
</template>
