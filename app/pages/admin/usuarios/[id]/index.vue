<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const userId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

const usersService = useUsersAdminService()
const user = ref<Awaited<ReturnType<typeof usersService.getById>>>(null)
const loading = ref(true)
const err = ref<string | null>(null)

const load = async () => {
  if (!userId.value) {
    return
  }
  loading.value = true
  err.value = null
  try {
    user.value = await usersService.getById(userId.value)
    if (!user.value) {
      err.value = 'Usuário não encontrado'
    }
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro ao carregar'
    user.value = null
  }
  finally {
    loading.value = false
  }
}

watch(userId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() => user.value?.full_name || user.value?.email || 'Usuário'),
})

const displayName = computed(() =>
  user.value?.full_name?.trim() || user.value?.email?.split('@')[0] || 'Usuário',
)
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Perfil do usuário"
      :description="user ? `${user.email} · ${user.status}` : 'Carregando…'"
      :breadcrumbs="[
        { label: 'Usuários', to: '/admin/usuarios' },
        { label: displayName },
      ]"
      :actions="[
        { key: 'edit', label: 'Editar', icon: 'lucide:pencil', variant: 'primary', to: `/admin/usuarios/${userId}/editar` },
        { key: 'back', label: 'Lista', variant: 'outline', to: '/admin/usuarios' },
      ]"
    />

    <div v-if="loading" class="text-center py-12 text-slate-500 text-sm">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else-if="user" class="grid gap-4 md:grid-cols-2">
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Identidade
        </h3>
        <div>
          <p class="text-xs text-slate-500">
            Nome
          </p>
          <p class="text-sm font-medium text-slate-900">
            {{ displayName }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            E-mail
          </p>
          <p class="text-sm text-slate-800">
            {{ user.email }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Telefone
          </p>
          <p class="text-sm text-slate-800">
            {{ user.phone || '—' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Cargo
          </p>
          <p class="text-sm text-slate-800">
            {{ user.job_title || '—' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-slate-500">
            Status
          </p>
          <p class="text-sm capitalize">
            {{ user.status }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 class="text-sm font-semibold text-slate-900">
          Papéis
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="r in user.roles"
            :key="r.id"
            class="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
          >
            {{ r.name }} ({{ r.slug }})
          </span>
          <span v-if="!user.roles.length" class="text-sm text-slate-500">Nenhum papel atribuído</span>
        </div>
        <NuxtLink to="/admin/permissoes" class="text-sm text-blue-600 font-medium hover:underline inline-block mt-2">
          Ver matriz de permissões
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
