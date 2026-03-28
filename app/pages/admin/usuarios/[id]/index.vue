<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const userId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Usuário' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Perfil do usuário"
      :description="`ID: ${userId}`"
      :breadcrumbs="[
        { label: 'Usuários', to: '/admin/usuarios' },
        { label: 'Detalhes' },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/usuarios/${userId}/editar` },
        { key: 'back', label: 'Lista', variant: 'outline', to: '/admin/usuarios' },
      ]"
    />
    <AdminPlaceholderNotice />
    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Identidade
        </h3>
        <AdminFieldStub label="Nome" />
        <AdminFieldStub label="E-mail" />
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Papéis
        </h3>
        <p class="text-sm text-slate-500">
          Lista de roles virá de <code class="text-xs bg-slate-100 px-1 rounded">user_roles</code>.
        </p>
        <NuxtLink to="/admin/permissoes" class="text-sm text-blue-600 font-medium hover:underline">Ver permissões</NuxtLink>
      </div>
    </div>
  </div>
</template>
