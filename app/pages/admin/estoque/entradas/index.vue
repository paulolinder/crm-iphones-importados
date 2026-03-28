<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Entradas de estoque' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Entradas de estoque"
      description="Registro de compras e reposição"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Entradas' },
      ]"
      :actions="[
        { key: 'new', label: 'Registrar entrada', icon: 'lucide:plus', variant: 'primary', to: '/admin/estoque/entrada' },
        { key: 'mov', label: 'Ver movimentações', variant: 'outline', to: '/admin/estoque/movimentacoes' },
      ]"
    />
    <AdminPlaceholderNotice description="Em breve esta tela listará notas fiscais e lotes vinculados a purchase_entries no Supabase." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-500 text-sm">
      Use
      <NuxtLink to="/admin/estoque/entrada" class="text-blue-600 font-medium hover:underline">Registrar entrada</NuxtLink>
      para o fluxo atual.
    </div>
  </div>
</template>
