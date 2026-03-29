<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Nova conta a pagar' })

const { registerPayable } = useFinance()
const { success, error: toastError } = useToast()

const form = reactive({
  description: '',
  amount: 0,
  due_date: '',
  supplier_id: '',
  notes: '',
})
const saving = ref(false)

const submit = async () => {
  if (!form.description.trim() || !form.due_date) {
    toastError('Validação', 'Preencha descrição e vencimento.')
    return
  }
  if (!form.amount || form.amount <= 0) {
    toastError('Validação', 'Informe o valor.')
    return
  }
  saving.value = true
  try {
    await registerPayable({
      description: form.description.trim(),
      amount: form.amount,
      due_date: form.due_date,
      supplier_id: form.supplier_id.trim() || undefined,
      notes: form.notes.trim() || undefined,
    })
    success('Conta criada', '')
    await navigateTo('/admin/financeiro/contas-pagar')
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
      title="Nova conta a pagar"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a pagar', to: '/admin/financeiro/contas-pagar' },
        { label: 'Nova' },
      ]"
      :actions="[
        { key: 'back', label: 'Cancelar', variant: 'outline', to: '/admin/financeiro/contas-pagar' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label class="form-label">Descrição *</label>
        <input v-model="form.description" type="text" class="form-input">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">Valor (R$) *</label>
          <input v-model.number="form.amount" type="number" step="0.01" min="0" class="form-input">
        </div>
        <div>
          <label class="form-label">Vencimento *</label>
          <input v-model="form.due_date" type="date" class="form-input">
        </div>
      </div>
      <div>
        <label class="form-label">ID do fornecedor (UUID, opcional)</label>
        <input v-model="form.supplier_id" type="text" class="form-input font-mono text-xs">
      </div>
      <div>
        <label class="form-label">Observações</label>
        <textarea v-model="form.notes" rows="2" class="form-input" />
      </div>
      <button type="button" class="btn-primary" :disabled="saving" @click="submit">
        {{ saving ? 'Salvando…' : 'Salvar' }}
      </button>
    </div>
  </div>
</template>
