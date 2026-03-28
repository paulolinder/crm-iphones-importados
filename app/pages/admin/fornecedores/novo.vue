<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Novo fornecedor' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo fornecedor"
      description="Cadastro de fornecedor e contatos comerciais"
      :breadcrumbs="[
        { label: 'Fornecedores', to: '/admin/fornecedores' },
        { label: 'Novo' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/fornecedores' },
      ]"
    />
    <AdminPlaceholderNotice description="Integração com a tabela suppliers será feita no service de fornecedores." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Razão social / nome" />
        <AdminFieldStub label="CNPJ / documento" />
        <AdminFieldStub label="E-mail" type="email" />
        <AdminFieldStub label="Telefone" />
        <AdminFieldStub label="Cidade / UF" />
        <AdminFieldStub label="Website" hint="https://" />
      </AdminFormGrid>
      <AdminFormGrid :columns="1">
        <AdminFieldStub label="Observações" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
      >
        Salvar fornecedor (placeholder)
      </button>
    </div>
  </div>
</template>
