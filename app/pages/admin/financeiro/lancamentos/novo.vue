<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Novo lançamento' })

const toast = useToast()
const { createTransaction } = useFinance()
const saving = ref(false)

const form = reactive({
  transaction_type: 'income' as 'income' | 'expense' | 'transfer' | 'adjustment',
  description: '',
  amount: 0,
  category: '',
})

const submit = async () => {
  saving.value = true
  try {
    const description = form.description.trim().length >= 3
      ? form.description.trim()
      : 'Lançamento manual'

    await createTransaction({
      transaction_type: form.transaction_type,
      description,
      amount: form.amount,
      category: form.category.trim() || undefined,
      occurred_at: new Date().toISOString(),
    })
    toast.success('Lançamento registrado')
    await navigateTo('/admin/financeiro/lancamentos')
  }
  catch (e) {
    toast.error(e instanceof Error ? e.message : 'Erro ao salvar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Novo lançamento"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Lançamentos', to: '/admin/financeiro/lancamentos' },
        { label: 'Novo' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/financeiro/lancamentos' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-2xl">
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-700">Tipo</label>
        <select
          v-model="form.transaction_type"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
        >
          <option value="income">
            Receita
          </option>
          <option value="expense">
            Despesa
          </option>
          <option value="transfer">
            Transferência
          </option>
          <option value="adjustment">
            Ajuste
          </option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-700">Descrição</label>
        <input
          v-model="form.description"
          type="text"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          placeholder="Ex.: Venda balcão"
        >
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input
            v-model.number="form.amount"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          >
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700">Categoria</label>
          <input
            v-model="form.category"
            type="text"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            placeholder="Opcional"
          >
        </div>
      </div>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white disabled:opacity-50"
        :disabled="saving || !form.amount"
        @click="submit"
      >
        {{ saving ? 'Salvando…' : 'Salvar lançamento' }}
      </button>
    </div>
  </div>
</template>
