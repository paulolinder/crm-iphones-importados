<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Backup — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Backup"
      description="Política de retenção e cópias de segurança"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Backup' },
      ]"
    />
    <div class="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 space-y-2">
      <p>
        Em produção, use os <strong>backups automáticos do Supabase</strong> (Dashboard → Database → Backups) e defina retenção com o provedor.
      </p>
      <p class="text-blue-800/90">
        Exportações CSV do CRM complementam o backup lógico, mas não substituem snapshot do banco.
      </p>
    </div>
  </div>
</template>
