<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Categorias — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Categorias"
      description="Árvore e ordem do catálogo"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Categorias' },
      ]"
      :actions="[
        { key: 'go', label: 'Gerenciar categorias', variant: 'primary', to: '/admin/produtos/categorias' },
      ]"
    />
    <p class="text-sm text-slate-600 max-w-xl">
      A listagem principal de categorias está em <NuxtLink to="/admin/produtos/categorias" class="text-blue-600 font-medium hover:underline">Produtos → Categorias</NuxtLink>. Aqui você encontra apenas o atalho de configuração.
    </p>
  </div>
</template>
