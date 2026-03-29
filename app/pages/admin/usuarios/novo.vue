<script setup lang="ts">
definePageMeta({ layout: 'admin' })

useHead({ title: 'Novo usuário' })

const usersService = useUsersAdminService()
const { session } = useAuth()
const { success, error: toastError } = useToast()

const allRoles = ref<{ id: string; slug: string; name: string }[]>([])
const form = reactive({
  email: '',
  password: '',
  full_name: '',
  phone: '',
  roleIds: [] as string[],
})
const saving = ref(false)

onMounted(async () => {
  try {
    allRoles.value = await usersService.listRoles()
  }
  catch {
    allRoles.value = []
  }
})

const toggleRole = (roleId: string) => {
  const i = form.roleIds.indexOf(roleId)
  if (i >= 0) {
    form.roleIds.splice(i, 1)
  }
  else {
    form.roleIds.push(roleId)
  }
}

const submit = async () => {
  if (!form.email.trim() || !form.password) {
    toastError('Validação', 'Informe e-mail e senha.')
    return
  }
  const token = session.value?.access_token
  if (!token) {
    toastError('Sessão', 'Faça login novamente.')
    return
  }

  saving.value = true
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        role_ids: form.roleIds.length ? form.roleIds : undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    success('Usuário criado', 'Você pode ajustar papéis em Editar se necessário.')
    await navigateTo('/admin/usuarios')
  }
  catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e
      ? String((e as { data?: { message?: string } }).data?.message ?? 'Erro')
      : e instanceof Error ? e.message : 'Não foi possível criar'
    toastError('Erro', msg)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo usuário"
      description="Cria conta no Supabase Auth e perfil. Requer permissão users.manage e SUPABASE_SERVICE_KEY no servidor."
      :breadcrumbs="[
        { label: 'Usuários', to: '/admin/usuarios' },
        { label: 'Novo' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/usuarios' },
      ]"
    />

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 max-w-xl">
      <div>
        <label class="form-label">E-mail *</label>
        <input v-model="form.email" type="email" required class="form-input" autocomplete="off">
      </div>
      <div>
        <label class="form-label">Senha inicial *</label>
        <input v-model="form.password" type="password" required class="form-input" autocomplete="new-password">
      </div>
      <div>
        <label class="form-label">Nome completo</label>
        <input v-model="form.full_name" type="text" class="form-input">
      </div>
      <div>
        <label class="form-label">Telefone</label>
        <input v-model="form.phone" type="text" class="form-input">
      </div>
      <div>
        <p class="text-sm font-medium text-slate-800 mb-2">
          Papéis (opcional)
        </p>
        <p class="text-xs text-slate-500 mb-2">
          Se não marcar, o trigger do banco atribui um papel padrão.
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
        <button type="button" class="btn-primary" :disabled="saving" @click="submit">
          {{ saving ? 'Criando…' : 'Criar usuário' }}
        </button>
        <NuxtLink to="/admin/usuarios" class="btn-outline">
          Cancelar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
