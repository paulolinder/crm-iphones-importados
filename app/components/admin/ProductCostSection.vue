<script setup lang="ts">
import type { ProductCostBreakdownInput } from '~~/domains/produtos/cost-breakdown'
import {
  computeBaseBrl,
  computeProfitMetrics,
  computeTotalCost,
} from '~~/domains/produtos/cost-breakdown'

const props = defineProps<{
  price: number
}>()

const breakdown = defineModel<ProductCostBreakdownInput>({ required: true })

const { format } = useCurrency()

const totalCost = computed(() => computeTotalCost(breakdown.value ?? {}))
const baseBrl = computed(() => computeBaseBrl(breakdown.value ?? {}))
const metrics = computed(() => computeProfitMetrics(props.price, totalCost.value))

const showUsdHint = computed(() => {
  const b = breakdown.value
  return Boolean(b?.import_usd && b?.usd_rate && b.import_usd > 0 && b.usd_rate > 0)
})
</script>

<template>
  <div class="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
    <div>
      <h3 class="text-sm font-semibold text-slate-900">
        Custos (opcional)
      </h3>
      <p class="text-xs text-slate-500 mt-0.5">
        Preencha o que fizer sentido. O custo total é somado automaticamente. Se usar importação em USD, informe valor em dólares e a cotação (R$ por US$); o sistema converte e soma frete, freteiro e NF-e.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div>
        <label class="form-label">Custo base (R$)</label>
        <input
          v-model.number="breakdown.base_cost_brl"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          placeholder="0"
        >
        <p class="text-[10px] text-slate-400 mt-0.5">
          Quando não usa USD abaixo
        </p>
      </div>
      <div>
        <label class="form-label">Valor produto (USD)</label>
        <input
          v-model.number="breakdown.import_usd"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          placeholder="0"
        >
      </div>
      <div>
        <label class="form-label">Cotação R$ / US$</label>
        <input
          v-model.number="breakdown.usd_rate"
          type="number"
          min="0"
          step="0.0001"
          class="form-input"
          placeholder="0"
        >
      </div>
      <div>
        <label class="form-label">Custo frete (R$)</label>
        <input
          v-model.number="breakdown.freight_cost"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          placeholder="0"
        >
      </div>
      <div>
        <label class="form-label">Custo freteiro (R$)</label>
        <input
          v-model.number="breakdown.carrier_cost"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          placeholder="0"
        >
      </div>
      <div>
        <label class="form-label">Custo NF-e (R$)</label>
        <input
          v-model.number="breakdown.nfe_cost"
          type="number"
          min="0"
          step="0.01"
          class="form-input"
          placeholder="0"
        >
      </div>
    </div>

    <p v-if="showUsdHint" class="text-xs text-slate-600">
      Base em R$ por importação: <span class="font-medium tabular-nums">{{ format(baseBrl) }}</span>
    </p>

    <div class="rounded-lg border border-slate-200 bg-white p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
      <div>
        <p class="text-xs text-slate-500">
          Custo total
        </p>
        <p class="text-lg font-semibold text-slate-900 tabular-nums">
          {{ format(totalCost) }}
        </p>
      </div>
      <div>
        <p class="text-xs text-slate-500">
          Lucro (R$)
        </p>
        <p
          class="text-lg font-semibold tabular-nums"
          :class="metrics.profit >= 0 ? 'text-emerald-700' : 'text-red-600'"
        >
          {{ format(metrics.profit) }}
        </p>
      </div>
      <div>
        <p class="text-xs text-slate-500">
          Margem sobre venda
        </p>
        <p class="text-lg font-semibold text-slate-900 tabular-nums">
          {{ metrics.marginPct.toFixed(1) }}%
        </p>
      </div>
      <div>
        <p class="text-xs text-slate-500">
          Markup sobre custo
        </p>
        <p class="text-lg font-semibold text-slate-700 tabular-nums">
          {{ Number.isFinite(metrics.markupPct) ? metrics.markupPct.toFixed(1) : '—' }}%
        </p>
      </div>
    </div>
  </div>
</template>
