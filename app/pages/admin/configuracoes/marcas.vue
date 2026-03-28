<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Marcas — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Marcas (configuração)"
      description="Atalho para gestão de marcas no catálogo"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Marcas' },
      ]"
      :actions="[
        { key: 'open', label: 'Abrir marcas', icon: 'lucide:external-link', variant: 'outline', to: '/admin/produtos/marcas' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <p class="text-sm text-slate-600">
        Gerenciamento principal em
        <NuxtLink to="/admin/produtos/marcas" class="text-blue-600 font-medium hover:underline">Produtos → Marcas</NuxtLink>.
      </p>
    </div>
  </div>
</template>
