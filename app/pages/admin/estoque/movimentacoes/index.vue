<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Movimentações de estoque' })

const { movements, movementsLoading, movementsError, loadMovements } = useInventory()

onMounted(() => {
  void loadMovements()
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Movimentações"
      description="Histórico consolidado de entradas, saídas e ajustes"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Movimentações' },
      ]"
      :actions="[
        { key: 'entry', label: 'Nova entrada', icon: 'lucide:package-plus', variant: 'primary', to: '/admin/estoque/entrada' },
        { key: 'exit', label: 'Registrar saída', icon: 'lucide:package-minus', variant: 'outline', to: '/admin/estoque/saida' },
      ]"
    />

    <div v-if="movementsLoading" class="text-center py-12 text-slate-500 text-sm">
      Carregando movimentações…
    </div>
    <div v-else-if="movementsError" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
      {{ movementsError.message }}
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50/80 text-left text-xs font-semibold text-slate-500 uppercase">
          <tr>
            <th class="px-6 py-3">
              Tipo
            </th>
            <th class="px-6 py-3">
              Produto
            </th>
            <th class="px-6 py-3 text-right">
              Qtd
            </th>
            <th class="px-6 py-3">
              Quando
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="m in movements" :key="m.id" class="hover:bg-slate-50/50">
            <td class="px-6 py-3 capitalize text-slate-700">
              {{ m.type?.replace('_', ' ') }}
            </td>
            <td class="px-6 py-3 text-slate-900">
              {{ m.product?.name ?? '—' }}
            </td>
            <td class="px-6 py-3 text-right font-medium">
              {{ m.quantity }}
            </td>
            <td class="px-6 py-3 text-slate-500">
              {{ m.created_at ? new Date(m.created_at).toLocaleString('pt-BR') : '—' }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="movements.length === 0" class="p-8 text-center text-slate-500 text-sm">
        Nenhuma movimentação registrada.
      </div>
    </div>
  </div>
</template>
