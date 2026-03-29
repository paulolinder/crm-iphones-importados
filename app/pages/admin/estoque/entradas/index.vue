<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Entradas de estoque' })

const inventory = useInventoryService()
const { format } = useCurrency()

const loading = ref(true)
const err = ref<string | null>(null)
const page = ref(1)
const rows = ref<{ id: string; entry_number: string; created_at: string; total_cost: number; supplier_name: string | null; invoice_number: string | null }[]>([])
const total = ref(0)
const perPage = 20

const load = async () => {
  loading.value = true
  err.value = null
  try {
    const res = await inventory.listPurchaseEntries({ page: page.value, per_page: perPage })
    rows.value = res.data.map(r => ({
      id: r.id,
      entry_number: r.entry_number,
      created_at: r.created_at,
      total_cost: r.total_cost,
      supplier_name: r.supplier_name,
      invoice_number: r.invoice_number,
    }))
    total.value = res.meta.total
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro ao carregar'
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
      title="Entradas de estoque"
      description="Notas de compra registradas (purchase_entries)"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Entradas' },
      ]"
      :actions="[
        { key: 'new', label: 'Registrar entrada', icon: 'lucide:plus', variant: 'primary', to: '/admin/estoque/entrada' },
        { key: 'mov', label: 'Ver movimentações', variant: 'outline', to: '/admin/estoque/movimentacoes' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ err }}
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-left text-slate-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3">
                Nº
              </th>
              <th class="px-4 py-3">
                Data
              </th>
              <th class="px-4 py-3">
                Fornecedor
              </th>
              <th class="px-4 py-3">
                NF
              </th>
              <th class="px-4 py-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in rows" :key="r.id">
              <td class="px-4 py-3 font-mono text-xs">
                {{ r.entry_number }}
              </td>
              <td class="px-4 py-3 text-slate-600">
                {{ new Date(r.created_at).toLocaleString() }}
              </td>
              <td class="px-4 py-3">
                {{ r.supplier_name || '—' }}
              </td>
              <td class="px-4 py-3">
                {{ r.invoice_number || '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                {{ format(r.total_cost) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!rows.length" class="p-8 text-center text-slate-500 text-sm">
        Nenhuma entrada encontrada. Use
        <NuxtLink to="/admin/estoque/entrada" class="text-blue-600 font-medium hover:underline">Registrar entrada</NuxtLink>.
      </div>
      <div v-if="total > perPage" class="flex justify-center gap-2 p-4 border-t border-slate-100">
        <button
          type="button"
          class="btn-outline text-sm"
          :disabled="page <= 1"
          @click="page--"
        >
          Anterior
        </button>
        <button
          type="button"
          class="btn-outline text-sm"
          :disabled="page * perPage >= total"
          @click="page++"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>
