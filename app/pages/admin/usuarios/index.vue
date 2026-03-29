<script setup lang="ts">
/**
 * Usuários — lista real (profiles + papéis)
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Usuários',
})

const { formatDate } = useDateFormat()
const usersService = useUsersAdminService()

const users = ref<Awaited<ReturnType<typeof usersService.list>>>([])
const loading = ref(true)
const loadError = ref<string | null>(null)

const load = async () => {
  loading.value = true
  loadError.value = null
  try {
    users.value = await usersService.list()
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Erro ao carregar usuários'
    users.value = []
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrador', color: 'text-violet-600 bg-violet-50' },
  manager: { label: 'Gerente', color: 'text-blue-600 bg-blue-50' },
  seller: { label: 'Vendedor', color: 'text-emerald-600 bg-emerald-50' },
  support: { label: 'Suporte', color: 'text-amber-600 bg-amber-50' },
  technician: { label: 'Técnico', color: 'text-slate-600 bg-slate-100' },
  inventory: { label: 'Estoque', color: 'text-cyan-600 bg-cyan-50' },
}

const primaryRoleSlug = (user: (typeof users.value)[0]) => user.roles[0]?.slug ?? 'manager'

const displayName = (user: (typeof users.value)[0]) =>
  (user.full_name?.trim() || user.email.split('@')[0]) ?? 'Usuário'

const statusDot = (status: string) => {
  if (status === 'active') return 'bg-emerald-500'
  if (status === 'blocked') return 'bg-red-500'
  return 'bg-slate-400'
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Usuários"
      description="Perfis e papéis sincronizados com o Supabase"
      :breadcrumbs="[{ label: 'Usuários' }]"
      :actions="[
        { key: 'perm', label: 'Permissões', icon: 'lucide:shield', variant: 'outline', to: '/admin/permissoes' },
        { key: 'new', label: 'Novo Usuário', icon: 'lucide:user-plus', variant: 'primary', to: '/admin/usuarios/novo' },
      ]"
    />

    <div v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ loadError }}
    </div>

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
            <p class="text-2xl font-bold text-slate-900">{{ users.filter(u => u.status === 'active').length }}</p>
            <p class="text-sm text-slate-500">Ativos</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-16 text-center text-slate-500 text-sm">
      Carregando usuários…
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="relative">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {{ displayName(user).charAt(0).toUpperCase() }}
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              :class="statusDot(user.status)"
            />
          </div>
          <NuxtLink
            :to="`/admin/usuarios/${user.id}`"
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Abrir perfil"
          >
            <Icon name="lucide:external-link" class="w-5 h-5" />
          </NuxtLink>
        </div>

        <div class="mb-4">
          <h3 class="font-semibold text-slate-900">
            {{ displayName(user) }}
          </h3>
          <p class="text-sm text-slate-500">
            {{ user.email }}
          </p>
          <p class="text-xs text-slate-400 mt-1 capitalize">
            Status: {{ user.status }}
          </p>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-2">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="roleConfig[primaryRoleSlug(user)]?.color ?? 'text-slate-600 bg-slate-100'"
          >
            {{ user.roles.map(r => r.name).join(', ') || 'Sem papel' }}
          </span>
          <span v-if="user.last_login_at" class="text-xs text-slate-400">
            Último acesso: {{ formatDate(new Date(user.last_login_at), 'dd/MM HH:mm') }}
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
