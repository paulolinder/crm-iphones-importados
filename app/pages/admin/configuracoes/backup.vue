<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Backup — Configurações' })

const { info: toastInfo, warning: toastWarning } = useToast()

function onSampleCsvClick() {
  toastInfo('Em breve', 'Download de amostra CSV será disponibilizado quando o backup estiver integrado.')
}

function onRestrictedClick() {
  toastWarning('Zona restrita', 'Operações destrutivas só via painel Supabase ou administrador de infraestrutura.')
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Backup e restauração"
      description="Exportação de dados e políticas de retenção"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Backup' },
      ]"
      :actions="[
        { key: 'export', label: 'Solicitar exportação', icon: 'lucide:download', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice description="Em produção, use backups nativos do Supabase e políticas de retenção do provedor." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <p class="text-sm text-slate-600">
        Último backup simulado: <span class="font-medium text-slate-900">—</span>
      </p>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
          @click="onSampleCsvClick"
        >
          Baixar amostra CSV
        </button>
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-700 hover:bg-red-50"
          @click="onRestrictedClick"
        >
          Zona restrita
        </button>
      </div>
    </div>
  </div>
</template>
