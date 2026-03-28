<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Nova Venda',
})

const { success, error: showError } = useToast()
const customersService = useCustomersService()
const productsService = useProductsService()
const ordersService = useOrdersService()

const customers = ref<{ id: string, name: string }[]>([])
const products = ref<{ id: string, name: string, price: number }[]>([])

const form = reactive({
  customer_id: '',
  payment_method: 'pix' as 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'transfer' | 'installment' | 'check' | 'other',
  notes: '',
  items: [
    {
      product_id: '',
      quantity: 1,
      unit_price: 0,
    },
  ],
})

const saving = ref(false)
const submitError = ref('')

onMounted(async () => {
  const [customersResponse, productsResponse] = await Promise.all([
    customersService.list({ page: 1, per_page: 100 }),
    productsService.list({ page: 1, per_page: 100 }),
  ])

  customers.value = customersResponse.data.map(customer => ({ id: customer.id, name: customer.name }))
  products.value = productsResponse.data.map(product => ({ id: product.id, name: product.name, price: product.price }))
})

const addItem = () => {
  form.items.push({
    product_id: '',
    quantity: 1,
    unit_price: 0,
  })
}

const updateItemPrice = (index: number) => {
  const currentItem = form.items[index]

  if (!currentItem) {
    return
  }

  const product = products.value.find(item => item.id === form.items[index].product_id)
  currentItem.unit_price = product?.price ?? 0
}

const handleSubmit = async () => {
  submitError.value = ''
  saving.value = true

  try {
    await ordersService.create({
      customer_id: form.customer_id,
      payment_method: form.payment_method,
      notes: form.notes,
      items: form.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    })

    success('Pedido criado', 'A venda foi registrada com sucesso.')
    await navigateTo('/admin/vendas')
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível registrar a venda.'
    submitError.value = message
    showError('Erro ao criar venda', message)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Nova Venda"
      description="Registre um novo pedido"
      :breadcrumbs="[
        { label: 'Vendas', to: '/admin/vendas' },
        { label: 'Nova venda' },
      ]"
    />

    <div class="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Cliente</label>
            <select v-model="form.customer_id" class="form-input">
              <option value="">Selecione</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name }}</option>
            </select>
          </div>

          <div>
            <label class="form-label">Pagamento</label>
            <select v-model="form.payment_method" class="form-input">
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="credit_card">Cartão de crédito</option>
              <option value="debit_card">Cartão de débito</option>
              <option value="transfer">Transferência</option>
            </select>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-100"
          >
            <div>
              <label class="form-label">Produto</label>
              <select v-model="item.product_id" class="form-input" @change="updateItemPrice(index)">
                <option value="">Selecione</option>
                <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
              </select>
            </div>

            <div>
              <label class="form-label">Quantidade</label>
              <input v-model.number="item.quantity" type="number" min="1" class="form-input" />
            </div>

            <div>
              <label class="form-label">Preço unitário</label>
              <input v-model.number="item.unit_price" type="number" min="0" step="0.01" class="form-input" />
            </div>
          </div>

          <button type="button" class="btn-outline" @click="addItem">
            Adicionar item
          </button>
        </div>

        <div>
          <label class="form-label">Observações</label>
          <textarea v-model="form.notes" class="form-input min-h-28" placeholder="Observações do pedido" />
        </div>

        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

        <div class="flex items-center justify-end gap-3">
          <NuxtLink to="/admin/vendas" class="btn-outline">Cancelar</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Registrar venda' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
