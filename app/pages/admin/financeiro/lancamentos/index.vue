<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Lançamentos financeiros' })

const { format } = useCurrency()
const { transactions, loading, error, loadTransactions } = useFinance()

onMounted(() => {
  void loadTransactions()
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Lançamentos"
      description="Histórico de receitas e despesas"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Lançamentos' },
      ]"
      :actions="[
        { key: 'new', label: 'Novo lançamento', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/lancamentos/novo' },
      ]"
    />
    <div v-if="loading" class="text-center py-10 text-slate-500 text-sm">
      Carregando…
    </div>
    <div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ error.message }}
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      <div
        v-for="t in transactions"
        :key="t.id"
        class="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <p class="text-sm font-medium text-slate-900">
            {{ t.description || 'Lançamento' }}
          </p>
          <p class="text-xs text-slate-500 capitalize">
            {{ t.transaction_type }} · {{ t.occurred_at ? new Date(t.occurred_at).toLocaleString('pt-BR') : '' }}
          </p>
        </div>
        <p class="text-sm font-bold" :class="t.transaction_type === 'income' ? 'text-emerald-600' : 'text-slate-800'">
          {{ format(t.amount) }}
        </p>
      </div>
      <div v-if="transactions.length === 0" class="p-8 text-center text-slate-500 text-sm">
        Nenhum lançamento.
      </div>
    </div>
  </div>
</template>
