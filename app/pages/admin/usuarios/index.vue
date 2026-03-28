<script setup lang="ts">
/**
 * Usuários - Gestão de usuários com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Usuários',
})

const { formatDate } = useDateFormat()

const users = ref([
  { id: '1', name: 'Administrador', email: 'admin@eleveimports.com', role: 'admin', status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', name: 'Carlos Vendedor', email: 'carlos@eleveimports.com', role: 'seller', status: 'online', lastLogin: new Date(Date.now() - 1000 * 60 * 15) },
  { id: '3', name: 'Ana Suporte', email: 'ana@eleveimports.com', role: 'support', status: 'offline', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '4', name: 'Pedro Técnico', email: 'pedro@eleveimports.com', role: 'technician', status: 'away', lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2) },
])

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrador', color: 'text-violet-600 bg-violet-50' },
  manager: { label: 'Gerente', color: 'text-blue-600 bg-blue-50' },
  seller: { label: 'Vendedor', color: 'text-emerald-600 bg-emerald-50' },
  support: { label: 'Suporte', color: 'text-amber-600 bg-amber-50' },
  technician: { label: 'Técnico', color: 'text-slate-600 bg-slate-100' },
}

const statusColors: Record<string, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  away: 'bg-amber-500',
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Usuários"
      description="Gerencie os usuários do sistema"
      :breadcrumbs="[{ label: 'Usuários' }]"
      :actions="[
        { key: 'perm', label: 'Permissões', icon: 'lucide:shield', variant: 'outline', to: '/admin/permissoes' },
        { key: 'new', label: 'Novo Usuário', icon: 'lucide:user-plus', variant: 'primary', to: '/admin/usuarios/novo' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:users" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ users.length }}</p>
            <p class="text-sm text-slate-500">Total de usuários</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:user-check" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ users.filter(u => u.status === 'online').length }}</p>
            <p class="text-sm text-slate-500">Online agora</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="relative">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {{ user.name.charAt(0) }}
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              :class="statusColors[user.status]"
            />
          </div>
          <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Icon name="lucide:more-horizontal" class="w-5 h-5" />
          </button>
        </div>

        <div class="mb-4">
          <h3 class="font-semibold text-slate-900">{{ user.name }}</h3>
          <p class="text-sm text-slate-500">{{ user.email }}</p>
        </div>

        <div class="flex items-center justify-between">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="roleConfig[user.role]?.color ?? 'text-slate-600 bg-slate-100'"
          >
            {{ roleConfig[user.role]?.label ?? user.role }}
          </span>
          <span class="text-xs text-slate-400">
            Último acesso: {{ formatDate(user.lastLogin, 'dd/MM HH:mm') }}
          </span>
        </div>
        <div class="mt-4 flex gap-2 pt-4 border-t border-slate-100">
          <NuxtLink
            :to="`/admin/usuarios/${user.id}`"
            class="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Perfil
          </NuxtLink>
          <NuxtLink
            :to="`/admin/usuarios/${user.id}/editar`"
            class="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Editar
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
