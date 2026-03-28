<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Empresa — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Dados da empresa"
      description="Razão social, CNPJ, endereço e contato institucional"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Empresa' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar alterações', icon: 'lucide:save', variant: 'primary' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Razão social" hint="Eleve Imports Ltda" />
        <AdminFieldStub label="Nome fantasia" hint="Eleve Imports" />
        <AdminFieldStub label="CNPJ" hint="00.000.000/0001-00" />
        <AdminFieldStub label="Inscrição estadual" hint="Opcional" />
        <AdminFieldStub label="E-mail comercial" hint="contato@eleve.com" type="email" />
        <AdminFieldStub label="Telefone" hint="(11) 99999-9999" />
      </AdminFormGrid>
      <AdminFormGrid :columns="1">
        <AdminFieldStub label="Endereço completo" hint="Rua, número, bairro, cidade — UF" />
      </AdminFormGrid>
    </div>
  </div>
</template>
