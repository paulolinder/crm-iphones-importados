<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Novo Cliente',
})

const { success, error: showError } = useToast()
const service = useCustomersService()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  document: '',
  document_type: 'cpf' as 'cpf' | 'cnpj' | 'rg' | 'passport' | 'other',
  status: 'active' as 'lead' | 'active' | 'inactive' | 'vip' | 'blocked',
  notes: '',
})

const saving = ref(false)
const submitError = ref('')

const handleSubmit = async () => {
  submitError.value = ''
  saving.value = true

  try {
    await service.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      whatsapp: form.whatsapp,
      document: form.document,
      document_type: form.document_type,
      status: form.status,
      notes: form.notes,
    })

    success('Cliente criado', 'O cliente foi salvo com sucesso.')
    await navigateTo('/admin/clientes')
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível criar o cliente.'
    submitError.value = message
    showError('Erro ao criar cliente', message)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo Cliente"
      description="Cadastre um novo cliente na base"
      :breadcrumbs="[
        { label: 'Clientes', to: '/admin/clientes' },
        { label: 'Novo cliente' },
      ]"
    />

    <div class="max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">Nome</label>
            <input v-model="form.name" class="form-input" placeholder="Nome do cliente" />
          </div>

          <div>
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="cliente@email.com" />
          </div>

          <div>
            <label class="form-label">Telefone</label>
            <input v-model="form.phone" class="form-input" placeholder="(11) 99999-0000" />
          </div>

          <div>
            <label class="form-label">WhatsApp</label>
            <input v-model="form.whatsapp" class="form-input" placeholder="(11) 99999-0000" />
          </div>

          <div>
            <label class="form-label">Documento</label>
            <input v-model="form.document" class="form-input" placeholder="CPF, CNPJ ou outro" />
          </div>

          <div>
            <label class="form-label">Tipo de documento</label>
            <select v-model="form.document_type" class="form-input">
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="rg">RG</option>
              <option value="passport">Passaporte</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div>
            <label class="form-label">Status</label>
            <select v-model="form.status" class="form-input">
              <option value="lead">Lead</option>
              <option value="active">Ativo</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </div>
        </div>

        <div>
          <label class="form-label">Observações</label>
          <textarea v-model="form.notes" class="form-input min-h-32" placeholder="Notas internas do cliente" />
        </div>

        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

        <div class="flex items-center justify-end gap-3">
          <NuxtLink to="/admin/clientes" class="btn-outline">Cancelar</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar cliente' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
