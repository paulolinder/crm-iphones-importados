<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Categorias' })

const productsService = useProductsService()
const rows = ref<{ id: string, name: string, slug: string }[]>([])
const loading = ref(true)
const err = ref<string | null>(null)

onMounted(async () => {
  try {
    const list = await productsService.listCategories()
    rows.value = list.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
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
      title="Categorias"
      description="Organize o catálogo por família de produtos"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Categorias' },
      ]"
      :actions="[
        { key: 'new', label: 'Nova categoria', icon: 'lucide:plus', variant: 'primary', to: '/admin/produtos/categorias/nova' },
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
          <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-50/50">
            <td class="px-6 py-4 font-medium text-slate-900">
              {{ c.name }}
            </td>
            <td class="px-6 py-4 text-slate-500">
              {{ c.slug }}
            </td>
            <td class="px-6 py-4 text-right">
              <NuxtLink
                :to="`/admin/produtos/categorias/${c.id}/editar`"
                class="text-blue-600 font-medium hover:underline"
              >
                Editar
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !err && rows.length === 0" class="p-8 text-center text-slate-500 text-sm">
        Nenhuma categoria.
      </div>
    </div>
  </div>
</template>
