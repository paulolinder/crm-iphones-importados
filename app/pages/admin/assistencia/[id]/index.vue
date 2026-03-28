<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const osId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Ordem de serviço' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Ordem de serviço"
      :description="`OS #${osId}`"
      :breadcrumbs="[
        { label: 'Assistência', to: '/admin/assistencia' },
        { label: `OS ${osId}` },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/assistencia/${osId}/editar` },
        { key: 'back', label: 'Lista', variant: 'outline', to: '/admin/assistencia' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div class="flex flex-wrap gap-2">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">Em diagnóstico</span>
      </div>
      <AdminFormGrid :columns="1">
        <AdminFieldStub label="Histórico / peças" />
      </AdminFormGrid>
    </div>
  </div>
</template>
