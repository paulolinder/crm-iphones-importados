<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Ajustes de estoque' })

const inventory = useInventoryService()
const { success, error: toastError } = useToast()

const stockRows = ref<{ product_id: string; label: string }[]>([])
const form = reactive({
  product_id: '',
  delta: 0,
  notes: '',
})
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await inventory.listStock({ per_page: 200 })
    stockRows.value = res.data.map(s => ({
      product_id: s.product_id,
      label: `${s.product_name}${s.sku ? ` (${s.sku})` : ''}`,
    }))
  }
  catch {
    stockRows.value = []
  }
  finally {
    loading.value = false
  }
})

const submit = async () => {
  if (!form.product_id) {
    toastError('Validação', 'Selecione um produto.')
    return
  }
  if (!form.delta) {
    toastError('Validação', 'Informe a variação (+ ou -).')
    return
  }
  saving.value = true
  try {
    await inventory.registerAdjustment({
      product_id: form.product_id,
      delta: form.delta,
      notes: form.notes.trim() || undefined,
    })
    success('Ajuste registrado', 'O saldo e a movimentação foram gravados.')
    form.delta = 0
    form.notes = ''
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao ajustar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Ajustes de inventário"
      description="Correções de saldo (movimentação tipo ajuste)"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Ajustes' },
      ]"
      :actions="[
        { key: 'mov', label: 'Histórico', variant: 'outline', to: '/admin/estoque/movimentacoes' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div v-if="loading" class="text-sm text-slate-500">
        Carregando produtos…
      </div>
      <template v-else>
        <div>
          <label class="form-label">Produto *</label>
          <select v-model="form.product_id" class="form-input">
            <option disabled value="">
              Selecione…
            </option>
            <option v-for="r in stockRows" :key="r.product_id" :value="r.product_id">
              {{ r.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="form-label">Variação em unidades *</label>
          <input v-model.number="form.delta" type="number" class="form-input" placeholder="Ex.: -2 ou +5">
        </div>
        <div>
          <label class="form-label">Motivo / observações</label>
          <textarea v-model="form.notes" rows="3" class="form-input" placeholder="Inventário, quebra, etc." />
        </div>
        <button
          type="button"
          class="btn-primary"
          :disabled="saving"
          @click="submit"
        >
          {{ saving ? 'Registrando…' : 'Registrar ajuste' }}
        </button>
      </template>
    </div>
  </div>
</template>
