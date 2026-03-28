<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Marcas' })

const productsService = useProductsService()
const rows = ref<{ id: string, name: string, slug: string }[]>([])
const loading = ref(true)
const err = ref<string | null>(null)

onMounted(async () => {
  try {
    const list = await productsService.listBrands()
    rows.value = list.map(b => ({ id: b.id, name: b.name, slug: b.slug }))
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro ao carregar'
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Marcas"
      description="Apple, Samsung e demais fabricantes"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Marcas' },
      ]"
      :actions="[
        { key: 'new', label: 'Nova marca', icon: 'lucide:plus', variant: 'primary', to: '/admin/produtos/marcas/nova' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-sm text-slate-500">
        Carregando…
      </div>
      <div v-else-if="err" class="p-8 text-center text-sm text-red-600">
        {{ err }}
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50/80 text-left text-xs font-semibold text-slate-500 uppercase">
          <tr>
            <th class="px-6 py-3">
              Nome
            </th>
            <th class="px-6 py-3">
              Slug
            </th>
            <th class="px-6 py-3 text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="b in rows" :key="b.id" class="hover:bg-slate-50/50">
            <td class="px-6 py-4 font-medium text-slate-900">
              {{ b.name }}
            </td>
            <td class="px-6 py-4 text-slate-500">
              {{ b.slug }}
            </td>
            <td class="px-6 py-4 text-right">
              <NuxtLink
                :to="`/admin/produtos/marcas/${b.id}/editar`"
                class="text-blue-600 font-medium hover:underline"
              >
                Editar
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !err && rows.length === 0" class="p-8 text-center text-slate-500 text-sm">
        Nenhuma marca.
      </div>
    </div>
  </div>
</template>
