<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const warrantyId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Garantia' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Detalhes da garantia"
      :description="`ID: ${warrantyId}`"
      :breadcrumbs="[
        { label: 'Garantias', to: '/admin/garantias' },
        { label: 'Detalhes' },
      ]"
      :actions="[
        { key: 'list', label: 'Voltar', variant: 'outline', to: '/admin/garantias' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Produto e cliente
        </h3>
        <AdminFieldStub label="Produto" />
        <AdminFieldStub label="Cliente" />
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Validade
        </h3>
        <AdminFieldStub label="Status" hint="valid | expiring | expired" />
        <AdminFieldStub label="Término" type="date" />
      </div>
    </div>
  </div>
</template>
