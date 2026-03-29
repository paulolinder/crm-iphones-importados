<script setup lang="ts">
import { downloadCsv } from '~/lib/csv'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar vendas' })

const orders = useOrdersService()
const { success, error: toastError } = useToast()
const loading = ref(false)

async function onExportCsvClick() {
  loading.value = true
  try {
    const res = await orders.list({ page: 1, per_page: 5000 })
    const rows = res.data.map(o => ({
      id: o.id,
      number: o.number,
      status: o.status,
      payment_status: o.payment_status,
      total: o.total,
      created_at: o.created_at,
      customer: o.customer?.name ?? '',
    }))
    downloadCsv(
      `vendas-${new Date().toISOString().slice(0, 10)}.csv`,
      ['id', 'number', 'status', 'payment_status', 'total', 'created_at', 'customer'],
      rows,
    )
    success('CSV gerado', `${rows.length} linhas`)
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
      title="Exportar vendas"
      description="Pedidos (orders) com totais"
      :breadcrumbs="[
        { label: 'Vendas', to: '/admin/vendas' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/vendas' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <p class="text-sm text-slate-600">
        Exporta até 5000 pedidos da listagem atual.
      </p>
      <button type="button" class="btn-primary" :disabled="loading" @click="onExportCsvClick">
        {{ loading ? 'Gerando…' : 'Gerar CSV' }}
      </button>
    </div>
  </div>
</template>
