<script setup lang="ts">
import { downloadCsv } from '~/lib/csv'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Exportar clientes' })

const customers = useCustomersService()
const { success, error: toastError } = useToast()
const loading = ref(false)

async function onExportCsvClick() {
  loading.value = true
  try {
    const res = await customers.list({ page: 1, per_page: 5000 })
    const rows = res.data.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email ?? '',
      phone: c.phone ?? '',
      status: c.status,
      total_orders: c.total_orders,
      total_spent: c.total_spent,
    }))
    downloadCsv(
      `clientes-${new Date().toISOString().slice(0, 10)}.csv`,
      ['id', 'name', 'email', 'phone', 'status', 'total_orders', 'total_spent'],
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
      title="Exportar clientes"
      description="Download CSV a partir da tabela customers"
      :breadcrumbs="[
        { label: 'Clientes', to: '/admin/clientes' },
        { label: 'Exportar' },
      ]"
      :actions="[
        { key: 'back', label: 'Voltar', variant: 'outline', to: '/admin/clientes' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <p class="text-sm text-slate-600">
        Exporta até 5000 registros com colunas principais. Para filtros avançados, use relatórios ou consultas diretas no Supabase.
      </p>
      <button
        type="button"
        class="btn-primary"
        :disabled="loading"
        @click="onExportCsvClick"
      >
        {{ loading ? 'Gerando…' : 'Gerar CSV' }}
      </button>
    </div>
  </div>
</template>
