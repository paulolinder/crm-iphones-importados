<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const userId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Editar usuário' })

const notifyFormPlaceholder = usePlaceholderSubmit()
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Editar usuário"
      :description="`ID: ${userId}`"
      :breadcrumbs="[
        { label: 'Usuários', to: '/admin/usuarios' },
        { label: 'Editar' },
      ]"
      :actions="[
        { key: 'view', label: 'Ver perfil', variant: 'outline', to: `/admin/usuarios/${userId}` },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <AdminFormGrid>
        <AdminFieldStub label="Status" hint="active | blocked" />
        <AdminFieldStub label="Cargo" />
        <AdminFieldStub label="Telefone" />
      </AdminFormGrid>
      <div class="border-t border-slate-100 pt-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-3">
          Papéis (placeholder)
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="r in ['admin', 'seller', 'inventory']"
            :key="r"
            class="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
          >{{ r }}</span>
        </div>
      </div>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white"
        @click="notifyFormPlaceholder"
      >
        Salvar alterações (placeholder)
      </button>
    </div>
  </div>
</template>
