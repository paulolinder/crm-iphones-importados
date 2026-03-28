<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Meu perfil — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Meu perfil"
      description="Nome, e-mail e alteração de senha"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Meu perfil' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar', icon: 'lucide:save', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice description="Os dados virão do Supabase Auth e da tabela profiles quando a edição estiver ativa." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Nome completo" />
        <AdminFieldStub label="E-mail" type="email" />
        <AdminFieldStub label="Cargo" hint="Administrador" />
        <AdminFieldStub label="Telefone" />
      </AdminFormGrid>
      <div class="border-t border-slate-100 pt-6 space-y-4">
        <h3 class="text-sm font-semibold text-slate-900">
          Segurança
        </h3>
        <AdminFormGrid>
          <AdminFieldStub label="Nova senha" type="password" hint="••••••••" />
          <AdminFieldStub label="Confirmar senha" type="password" hint="••••••••" />
        </AdminFormGrid>
      </div>
    </div>
  </div>
</template>
