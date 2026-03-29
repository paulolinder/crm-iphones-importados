<script setup lang="ts">
import type { Tables } from '~/lib/supabase/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Caixa' })

const finance = useFinanceService()
const { format } = useCurrency()

const loading = ref(true)
const err = ref<string | null>(null)
const accounts = ref<Tables<'cash_accounts'>[]>([])

onMounted(async () => {
  loading.value = true
  try {
    accounts.value = await finance.listCashAccounts()
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro'
    accounts.value = []
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Caixa"
      description="Contas em cash_accounts (saldo atual no banco)"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Caixa' },
      ]"
      :actions="[
        { key: 'tx', label: 'Novo lançamento', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/lancamentos/novo' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else class="grid gap-4 md:grid-cols-3">
      <div
        v-for="acc in accounts"
        :key="acc.id"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <p class="text-xs font-semibold text-slate-500 uppercase">
          {{ acc.name }}
        </p>
        <p class="mt-2 text-xl font-bold text-slate-900">
          {{ format(acc.current_balance) }}
        </p>
        <span class="inline-flex mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{{ acc.account_type }}</span>
      </div>
    </div>
    <p v-if="!loading && !err && !accounts.length" class="text-sm text-slate-500">
      Nenhuma conta de caixa cadastrada ou ativa.
    </p>
  </div>
</template>
