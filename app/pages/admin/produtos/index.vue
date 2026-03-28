<script setup lang="ts">
/**
 * Produtos - Lista de produtos com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Produtos',
})

const { format } = useCurrency()

const searchQuery = ref('')
const selectedCategory = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const { products, loading, error, pagination, updateFilters, loadProducts } = useProducts()
const productsService = useProductsService()
const categories = ref<{ id: string, name: string }[]>([])
const stats = ref({
  total: 0,
  active: 0,
  lowStock: 0,
  outOfStock: 0,
})

const refreshStats = async () => {
  const response = await productsService.getStats()

  stats.value = {
    total: response.total,
    active: response.active,
    lowStock: response.low_stock,
    outOfStock: response.out_of_stock,
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Em estoque', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  low_stock: { label: 'Estoque baixo', bg: 'bg-amber-50', text: 'text-amber-700' },
  out_of_stock: { label: 'Sem estoque', bg: 'bg-red-50', text: 'text-red-700' },
}

const getStockStatus = (product: { stock_quantity: number, min_stock: number }) => {
  if (product.stock_quantity === 0) {
    return statusConfig.out_of_stock
  }

  if (product.stock_quantity <= product.min_stock) {
    return statusConfig.low_stock
  }

  return statusConfig.active
}

const syncFilters = useDebounceFn(async () => {
  updateFilters({
    search: searchQuery.value || undefined,
    category_id: selectedCategory.value || undefined,
  })

  pagination.currentPage.value = 1
  await loadProducts()
  await refreshStats()
}, 250)

watch([searchQuery, selectedCategory], () => {
  void syncFilters()
})

watch(() => pagination.currentPage.value, () => {
  void loadProducts()
})

onMounted(async () => {
  const [categoryRows] = await Promise.all([
    productsService.listCategories(),
    loadProducts(),
    refreshStats(),
  ])

  categories.value = categoryRows.map(category => ({ id: category.id, name: category.name }))
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Produtos"
      description="Catálogo de produtos da loja"
      :breadcrumbs="[{ label: 'Produtos' }]"
      :actions="[
        { key: 'cats', label: 'Categorias', icon: 'lucide:folder', variant: 'ghost', to: '/admin/produtos/categorias' },
        { key: 'brands', label: 'Marcas', icon: 'lucide:award', variant: 'ghost', to: '/admin/produtos/marcas' },
        { key: 'import', label: 'Importar', icon: 'lucide:upload', variant: 'outline', to: '/admin/produtos/importar' },
        { key: 'new', label: 'Novo Produto', icon: 'lucide:plus', variant: 'primary', to: '/admin/produtos/novo' },
      ]"
    />

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Icon name="lucide:package" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
            <p class="text-sm text-slate-500">Total de produtos</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Icon name="lucide:check-circle" class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.active }}</p>
            <p class="text-sm text-slate-500">Em estoque</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.lowStock }}</p>
            <p class="text-sm text-slate-500">Estoque baixo</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Icon name="lucide:x-circle" class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stats.outOfStock }}</p>
            <p class="text-sm text-slate-500">Sem estoque</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-slate-100">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1 relative">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou SKU..."
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div class="flex gap-3">
          <select
            v-model="selectedCategory"
            class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Todas as categorias</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <div class="flex bg-slate-100 rounded-xl p-1">
            <button
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
              @click="viewMode = 'grid'"
            >
              <Icon name="lucide:grid" class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
              @click="viewMode = 'list'"
            >
              <Icon name="lucide:list" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      >
        <!-- Image -->
        <div class="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <Icon name="lucide:package" class="w-16 h-16 text-slate-300" />
          <!-- Status Badge -->
          <div class="absolute top-3 left-3">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-semibold"
              :class="[getStockStatus(product).bg, getStockStatus(product).text]"
            >
              {{ getStockStatus(product).label }}
            </span>
          </div>
          <!-- Quick Actions -->
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <NuxtLink
              :to="`/admin/produtos/${product.id}`"
              class="p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-blue-600 transition-colors"
              title="Ver detalhes"
            >
              <Icon name="lucide:eye" class="w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="`/admin/produtos/${product.id}/editar`"
              class="p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Icon name="lucide:edit" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <p class="text-xs text-slate-400 font-medium mb-1">{{ product.sku }}</p>
          <h3 class="font-semibold text-slate-900 mb-2 line-clamp-2">{{ product.name }}</h3>

          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-slate-900">{{ format(product.price) }}</span>
            <span class="text-sm text-slate-500">{{ product.stock_quantity }} un.</span>
          </div>

          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span class="text-slate-500">{{ product.category?.name || 'Sem categoria' }}</span>
            <span class="text-emerald-600 font-medium">Min. {{ product.min_stock }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Products List -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50/50">
            <th class="text-left px-5 lg:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
            <th class="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
            <th class="text-right px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preço</th>
            <th class="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estoque</th>
            <th class="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
            <th class="text-right px-5 lg:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-5 lg:px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon name="lucide:package" class="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p class="font-medium text-slate-900">{{ product.name }}</p>
                  <p class="text-sm text-slate-500">{{ product.sku }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 hidden md:table-cell">
              <span class="text-slate-700">{{ product.category?.name || 'Sem categoria' }}</span>
            </td>
            <td class="text-right px-4 py-4">
              <span class="font-semibold text-slate-900">{{ format(product.price) }}</span>
            </td>
            <td class="text-center px-4 py-4">
              <span
                class="font-semibold"
                :class="[
                  product.stock_quantity > product.min_stock ? 'text-slate-700' : '',
                  product.stock_quantity <= product.min_stock && product.stock_quantity > 0 ? 'text-amber-600' : '',
                  product.stock_quantity === 0 ? 'text-red-600' : '',
                ]"
              >
                {{ product.stock_quantity }}
              </span>
            </td>
            <td class="text-center px-4 py-4 hidden lg:table-cell">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-medium"
                :class="[getStockStatus(product).bg, getStockStatus(product).text]"
              >
                {{ getStockStatus(product).label }}
              </span>
            </td>
            <td class="text-right px-5 lg:px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <NuxtLink
                  :to="`/admin/produtos/${product.id}`"
                  class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Ver detalhes"
                >
                  <Icon name="lucide:eye" class="w-4 h-4" />
                </NuxtLink>
                <NuxtLink
                  :to="`/admin/produtos/${product.id}/editar`"
                  class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="lucide:edit" class="w-4 h-4" />
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="px-6 py-10 text-center text-sm text-slate-500">
        Carregando produtos...
      </div>

      <div v-else-if="!products.length" class="px-6 py-10 text-center text-sm text-slate-500">
        {{ error?.message || 'Nenhum produto encontrado.' }}
      </div>
    </div>
  </div>
</template>
