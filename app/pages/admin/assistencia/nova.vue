<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova OS — Assistência' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova ordem de serviço"
      description="Abertura de assistência técnica"
      :breadcrumbs="[
        { label: 'Assistência', to: '/admin/assistencia' },
        { label: 'Nova OS' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/assistencia' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Cliente" />
        <AdminFieldStub label="Aparelho / modelo" />
        <AdminFieldStub label="IMEI" />
        <AdminFieldStub label="Defeito relatado" />
        <AdminFieldStub label="Prioridade" hint="normal | alta" />
        <AdminFieldStub label="Técnico responsável" />
      </AdminFormGrid>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white"
        @click="notifyFormPlaceholder"
      >
        Abrir OS (placeholder)
      </button>
    </div>
  </div>
</template>
