<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Meu perfil — Configurações' })

const { client } = useSupabase()
const { profile, refresh } = useAuth()
const { success, error: toastError } = useToast()

const form = reactive({
  full_name: '',
  phone: '',
  job_title: '',
  newPassword: '',
  confirmPassword: '',
})
const saving = ref(false)

watchEffect(() => {
  if (profile.value) {
    form.full_name = profile.value.full_name ?? ''
    form.phone = profile.value.phone ?? ''
    form.job_title = profile.value.job_title ?? ''
  }
})

async function save() {
  if (!profile.value?.id) {
    toastError('Sessão', 'Faça login novamente.')
    return
  }
  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    toastError('Senha', 'Confirmação não confere.')
    return
  }
  saving.value = true
  try {
    const { error } = await client
      .from('profiles')
      .update({
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        job_title: form.job_title.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.value.id)

    if (error) {
      throw error
    }

    if (form.newPassword && form.newPassword.length >= 6) {
      const { error: pwErr } = await client.auth.updateUser({ password: form.newPassword })
      if (pwErr) {
        throw pwErr
      }
    }

    success('Perfil atualizado', '')
    form.newPassword = ''
    form.confirmPassword = ''
    await refresh()
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao salvar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Meu perfil"
      description="profiles + Supabase Auth (senha)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Meu perfil' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar', icon: 'lucide:save', variant: 'primary', onClick: save },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="form-label">Nome completo</label>
          <input v-model="form.full_name" type="text" class="form-input">
        </div>
        <div>
          <label class="form-label">E-mail</label>
          <input :value="profile?.email ?? ''" type="email" class="form-input bg-slate-50" disabled>
        </div>
        <div>
          <label class="form-label">Cargo</label>
          <input v-model="form.job_title" type="text" class="form-input">
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Telefone</label>
          <input v-model="form.phone" type="text" class="form-input">
        </div>
      </div>
      <div class="border-t border-slate-100 pt-6 space-y-4">
        <h3 class="text-sm font-semibold text-slate-900">
          Segurança
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Nova senha</label>
            <input v-model="form.newPassword" type="password" class="form-input" autocomplete="new-password">
          </div>
          <div>
            <label class="form-label">Confirmar senha</label>
            <input v-model="form.confirmPassword" type="password" class="form-input" autocomplete="new-password">
          </div>
        </div>
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="save">
        {{ saving ? 'Salvando…' : 'Salvar alterações' }}
      </button>
    </div>
  </div>
</template>
