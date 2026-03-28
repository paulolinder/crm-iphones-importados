<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Usuários (config) — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Usuários e acessos"
      description="Políticas gerais; gestão de contas na área dedicada"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Usuários' },
      ]"
      :actions="[
        { key: 'list', label: 'Ir para usuários', icon: 'lucide:users', variant: 'primary', to: '/admin/usuarios' },
        { key: 'perm', label: 'Permissões', icon: 'lucide:shield', variant: 'outline', to: '/admin/permissoes' },
      ]"
    />
    <AdminPlaceholderNotice description="Convites, reset de senha e papéis continuam centralizados em Usuários e Permissões." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <ul class="text-sm text-slate-600 space-y-2 list-disc pl-5">
        <li>Cadastro e edição: <NuxtLink class="text-blue-600 font-medium" to="/admin/usuarios">/admin/usuarios</NuxtLink></li>
        <li>Matriz de permissões: <NuxtLink class="text-blue-600 font-medium" to="/admin/permissoes">/admin/permissoes</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>
