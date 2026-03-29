<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Marcas — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Marcas"
      description="Catálogo de marcas"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Marcas' },
      ]"
      :actions="[
        { key: 'go', label: 'Gerenciar marcas', variant: 'primary', to: '/admin/produtos/marcas' },
      ]"
    />
    <p class="text-sm text-slate-600 max-w-xl">
      A listagem e edição de marcas estão em <NuxtLink to="/admin/produtos/marcas" class="text-blue-600 font-medium hover:underline">Produtos → Marcas</NuxtLink>.
    </p>
  </div>
</template>
