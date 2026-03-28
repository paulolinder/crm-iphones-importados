<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Entrada de Estoque',
})

const { success, error: showError } = useToast()
const inventoryService = useInventoryService()
const productsService = useProductsService()

const products = ref<{ id: string, name: string }[]>([])
const form = reactive({
  product_id: '',
  quantity: 1,
  unit_cost: 0,
  invoice_number: '',
  notes: '',
  imeis: '',
})

const saving = ref(false)
const submitError = ref('')

onMounted(async () => {
  const response = await productsService.list({ page: 1, per_page: 100 })
  products.value = response.data.map(product => ({ id: product.id, name: product.name }))
})

const handleSubmit = async () => {
  submitError.value = ''
  saving.value = true

  try {
    await inventoryService.registerEntry({
      product_id: form.product_id,
      quantity: form.quantity,
      unit_cost: form.unit_cost,
      invoice_number: form.invoice_number,
      notes: form.notes,
      imeis: form.imeis
        .split('\n')
        .map(value => value.trim())
        .filter(Boolean),
    })

    success('Entrada registrada', 'O estoque foi atualizado com sucesso.')
    await navigateTo('/admin/estoque')
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível registrar a entrada.'
    submitError.value = message
    showError('Erro ao registrar entrada', message)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Entrada de Estoque"
      description="Registre uma nova entrada de produtos"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Entrada' },
      ]"
    />

    <div class="max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">Produto</label>
            <select v-model="form.product_id" class="form-input">
              <option value="">Selecione</option>
              <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
            </select>
          </div>

          <div>
            <label class="form-label">Quantidade</label>
            <input v-model.number="form.quantity" type="number" min="1" class="form-input" />
          </div>

          <div>
            <label class="form-label">Custo unitário</label>
            <input v-model.number="form.unit_cost" type="number" min="0" step="0.01" class="form-input" />
          </div>

          <div class="md:col-span-2">
            <label class="form-label">Número da nota</label>
            <input v-model="form.invoice_number" class="form-input" placeholder="NF ou referência de compra" />
          </div>
        </div>

        <div>
          <label class="form-label">IMEIs (um por linha)</label>
          <textarea v-model="form.imeis" class="form-input min-h-32" placeholder="Opcional para aparelhos rastreáveis" />
        </div>

        <div>
          <label class="form-label">Observações</label>
          <textarea v-model="form.notes" class="form-input min-h-28" placeholder="Detalhes da entrada" />
        </div>

        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

        <div class="flex items-center justify-end gap-3">
          <NuxtLink to="/admin/estoque" class="btn-outline">Cancelar</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Registrar entrada' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
