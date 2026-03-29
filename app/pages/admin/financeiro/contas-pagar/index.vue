<script setup lang="ts">
import type { AccountsPayable } from '~~/domains/financeiro/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Contas a pagar' })

const { listPayables } = useFinance()
const { format } = useCurrency()

const loading = ref(true)
const err = ref<string | null>(null)
const rows = ref<AccountsPayable[]>([])
const total = ref(0)
const page = ref(1)
const perPage = 20

const load = async () => {
  loading.value = true
  err.value = null
  try {
    const res = await listPayables({ page: page.value, per_page: perPage })
    rows.value = res.data
    total.value = res.meta.total
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro'
    rows.value = []
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})

watch(page, () => {
  void load()
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Contas a pagar"
      description="Tabela accounts_payable"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Contas a pagar' },
      ]"
      :actions="[
        { key: 'new', label: 'Nova conta', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/contas-pagar/nova' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left text-slate-500 text-xs uppercase">
          <tr>
            <th class="px-4 py-3">
              Descrição
            </th>
            <th class="px-4 py-3">
              Vencimento
            </th>
            <th class="px-4 py-3">
              Status
            </th>
            <th class="px-4 py-3 text-right">
              Valor
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in rows" :key="r.id">
            <td class="px-4 py-3">
              {{ r.description }}
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ r.due_date?.slice(0, 10) }}
            </td>
            <td class="px-4 py-3 capitalize">
              {{ r.status }}
            </td>
            <td class="px-4 py-3 text-right">
              {{ format(r.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!rows.length" class="p-8 text-center text-slate-500 text-sm">
        Nenhum registro.
      </div>
      <div v-if="total > perPage" class="flex justify-center gap-2 p-4 border-t border-slate-100">
        <button type="button" class="btn-outline text-sm" :disabled="page <= 1" @click="page--">
          Anterior
        </button>
        <button type="button" class="btn-outline text-sm" :disabled="page * perPage >= total" @click="page++">
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>
