<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Usuários — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Usuários"
      description="Gestão centralizada de contas e papéis"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Usuários' },
      ]"
      :actions="[
        { key: 'users', label: 'Abrir usuários', icon: 'lucide:users', variant: 'primary', to: '/admin/usuarios' },
        { key: 'perm', label: 'Permissões', variant: 'outline', to: '/admin/permissoes' },
      ]"
    />
    <p class="text-sm text-slate-600 max-w-xl">
      Convites, papéis e permissões são geridos nas telas <NuxtLink to="/admin/usuarios" class="text-blue-600 font-medium hover:underline">Usuários</NuxtLink> e <NuxtLink to="/admin/permissoes" class="text-blue-600 font-medium hover:underline">Permissões</NuxtLink>.
    </p>
  </div>
</template>
