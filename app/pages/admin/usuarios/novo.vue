<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Novo usuário' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo usuário"
      description="Convite ou cadastro interno (Supabase Auth)"
      :breadcrumbs="[
        { label: 'Usuários', to: '/admin/usuarios' },
        { label: 'Novo' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/usuarios' },
        { key: 'perm', label: 'Matriz de permissões', variant: 'ghost', to: '/admin/permissoes' },
      ]"
    />
    <AdminPlaceholderNotice description="Fluxo recomendado: convite por e-mail ou criação no painel Supabase + vínculo de roles em user_roles." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome completo" />
        <AdminFieldStub label="E-mail" type="email" />
        <AdminFieldStub label="Papel inicial" hint="admin | seller | …" />
        <AdminFieldStub label="Cargo exibido" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      >
        Criar usuário (placeholder)
      </button>
    </div>
  </div>
</template>
