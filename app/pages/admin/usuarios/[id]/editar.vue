<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const userId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw ?? '')
})

useHead({ title: 'Editar usuário' })

const usersService = useUsersAdminService()
const { success, error: toastError } = useToast()

const loading = ref(true)
const saving = ref(false)
const allRoles = ref<{ id: string; slug: string; name: string }[]>([])

const form = reactive({
  full_name: '',
  phone: '',
  job_title: '',
  status: 'active' as 'active' | 'inactive' | 'blocked',
  roleIds: [] as string[],
})

const load = async () => {
  if (!userId.value) {
    return
  }
  loading.value = true
  try {
    const [u, roles] = await Promise.all([
      usersService.getById(userId.value),
      usersService.listRoles(),
    ])
    allRoles.value = roles
    if (u) {
      form.full_name = u.full_name ?? ''
      form.phone = u.phone ?? ''
      form.job_title = u.job_title ?? ''
      form.status = u.status
      form.roleIds = u.roles.map(r => r.id)
    }
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

watch(userId, () => {
  void load()
}, { immediate: true })

const toggleRole = (roleId: string) => {
  const i = form.roleIds.indexOf(roleId)
  if (i >= 0) {
    form.roleIds.splice(i, 1)
  }
  else {
    form.roleIds.push(roleId)
  }
}

const save = async () => {
  if (!userId.value) {
    return
  }
  saving.value = true
  try {
    await usersService.updateProfile(userId.value, {
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      job_title: form.job_title.trim() || null,
      status: form.status,
    })
    await usersService.setUserRoles(userId.value, form.roleIds)
    success('Salvo', 'Usuário atualizado.')
    await navigateTo(`/admin/usuarios/${userId.value}`)
  }
  catch (e) {
    toastError('Erro ao salvar', e instanceof Error ? e.message : 'Tente novamente')
  }
  finally {
    saving.value = false
  }
}
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

    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-3xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="form-label">Nome completo</label>
          <input v-model="form.full_name" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">Telefone</label>
          <input v-model="form.phone" type="text" class="form-input" placeholder="(11) 99999-0000">
        </div>
        <div>
          <label class="form-label">Cargo</label>
          <input v-model="form.job_title" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-input">
            <option value="active">
              Ativo
            </option>
            <option value="inactive">
              Inativo
            </option>
            <option value="blocked">
              Bloqueado
            </option>
          </select>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-6">
        <h3 class="text-sm font-semibold text-slate-900 mb-3">
          Papéis
        </h3>
        <p class="text-xs text-slate-500 mb-3">
          Marque os papéis deste usuário (permissoes derivadas de cada papel).
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="role in allRoles"
            :key="role.id"
            type="button"
            class="px-3 py-2 rounded-xl text-sm font-medium border transition-colors"
            :class="form.roleIds.includes(role.id)
              ? 'border-blue-500 bg-blue-50 text-blue-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
            @click="toggleRole(role.id)"
          >
            {{ role.name }}
          </button>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="button"
          class="btn-primary"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? 'Salvando…' : 'Salvar alterações' }}
        </button>
        <NuxtLink to="/admin/usuarios" class="btn-outline">
          Cancelar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
