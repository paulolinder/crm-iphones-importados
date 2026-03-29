<script setup lang="ts">
import { downloadCsv } from '~/lib/csv'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar financeiro' })

const finance = useFinanceService()
const { success, error: toastError } = useToast()
const loading = ref(false)

async function onExportCsvClick() {
  loading.value = true
  try {
    const res = await finance.listTransactions({ page: 1, per_page: 5000 })
    const rows = res.data.map(t => ({
      id: t.id,
      transaction_type: t.transaction_type,
      description: t.description,
      amount: t.amount,
      occurred_at: t.occurred_at,
      category: t.category ?? '',
    }))
    downloadCsv(
      `financeiro-${new Date().toISOString().slice(0, 10)}.csv`,
      ['id', 'transaction_type', 'description', 'amount', 'occurred_at', 'category'],
      rows,
    )
    success('CSV gerado', `${rows.length} lançamentos`)
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha na exportação')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Exportar financeiro"
      description="financial_transactions"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/financeiro' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <p class="text-sm text-slate-600">
        Exporta lançamentos financeiros (até 5000 por arquivo).
      </p>
      <button type="button" class="btn-primary" :disabled="loading" @click="onExportCsvClick">
        {{ loading ? 'Gerando…' : 'Gerar CSV' }}
      </button>
    </div>
  </div>
</template>
