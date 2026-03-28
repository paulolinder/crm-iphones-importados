<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Categorias — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Categorias (configuração)"
      description="Atalho para gestão de categorias no catálogo"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Categorias' },
      ]"
      :actions="[
        { key: 'open', label: 'Abrir catálogo', icon: 'lucide:external-link', variant: 'outline', to: '/admin/produtos/categorias' },
      ]"
    />
    <AdminPlaceholderNotice description="A listagem principal de categorias está em Catálogo. Aqui você pode futuramente definir regras globais (ordem, visibilidade)." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <p class="text-sm text-slate-600 mb-4">
        Prefira gerenciar itens em
        <NuxtLink to="/admin/produtos/categorias" class="text-blue-600 font-medium hover:underline">Produtos → Categorias</NuxtLink>.
      </p>
      <AdminFieldStub label="Prefixo de slug (opcional)" hint="ex.: loja" />
    </div>
  </div>
</template>
