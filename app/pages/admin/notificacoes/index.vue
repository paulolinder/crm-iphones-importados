<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Notificações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Central de notificações"
      description="Histórico de alertas do sistema"
      :breadcrumbs="[{ label: 'Notificações' }]"
      :actions="[
        { key: 'settings', label: 'Preferências', icon: 'lucide:settings', variant: 'outline', to: '/admin/configuracoes/notificacoes' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      <div
        v-for="n in [
          { t: 'Estoque baixo', m: 'AirPods Pro — 3 unidades', time: 'Hoje, 10:32' },
          { t: 'Pedido confirmado', m: 'Pedido #2847', time: 'Ontem' },
        ]"
        :key="n.t"
        class="px-6 py-4 flex gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon name="lucide:bell" class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-900">
            {{ n.t }}
          </p>
          <p class="text-sm text-slate-500">
            {{ n.m }}
          </p>
          <p class="text-xs text-slate-400 mt-1">
            {{ n.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
