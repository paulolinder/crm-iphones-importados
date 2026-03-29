<script setup lang="ts">
import type { StockExitFormData } from '~~/domains/estoque/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Saída de estoque' })

const inventory = useInventoryService()
const { success, error: toastError } = useToast()

const stockRows = ref<{ product_id: string; label: string }[]>([])
const form = reactive({
  product_id: '',
  quantity: 1,
  reason: 'other' as StockExitFormData['reason'],
  notes: '',
  imeisText: '',
})
const loading = ref(true)
const saving = ref(false)

const reasons: { value: StockExitFormData['reason']; label: string }[] = [
  { value: 'sale', label: 'Venda manual' },
  { value: 'return', label: 'Devolução' },
  { value: 'damaged', label: 'Avaria' },
  { value: 'lost', label: 'Perda' },
  { value: 'other', label: 'Outro' },
]

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
  if (!form.quantity || form.quantity < 1) {
    toastError('Validação', 'Informe a quantidade.')
    return
  }
  const imeis = form.imeisText
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(Boolean)

  saving.value = true
  try {
    await inventory.registerMovement({
      product_id: form.product_id,
      quantity: form.quantity,
      reason: form.reason,
      notes: form.notes.trim() || undefined,
      imeis: imeis.length ? imeis : undefined,
    })
    success('Saída registrada', '')
    form.quantity = 1
    form.notes = ''
    form.imeisText = ''
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha na saída')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Saída de estoque"
      description="Baixa com validação de saldo e IMEI opcional"
      :breadcrumbs="[
        { label: 'Estoque', to: '/admin/estoque' },
        { label: 'Saída' },
      ]"
      :actions="[
        { key: 'cancel', label: 'Cancelar', variant: 'outline', to: '/admin/estoque' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-xl">
      <div v-if="loading" class="text-sm text-slate-500">
        Carregando…
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
          <label class="form-label">Quantidade *</label>
          <input v-model.number="form.quantity" type="number" min="1" class="form-input">
        </div>
        <div>
          <label class="form-label">Tipo de saída *</label>
          <select v-model="form.reason" class="form-input">
            <option v-for="r in reasons" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="form-label">IMEIs (opcional, um por linha ou separados por vírgula)</label>
          <textarea v-model="form.imeisText" rows="2" class="form-input font-mono text-xs" />
        </div>
        <div>
          <label class="form-label">Observações</label>
          <textarea v-model="form.notes" rows="2" class="form-input" />
        </div>
        <button type="button" class="btn-primary" :disabled="saving" @click="submit">
          {{ saving ? 'Processando…' : 'Confirmar saída' }}
        </button>
      </template>
    </div>
  </div>
</template>
