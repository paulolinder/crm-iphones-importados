/**
 * Decomposição de custo do produto (importação, frete, NF-e) e totais.
 */

export interface ProductCostBreakdownInput {
  /** Custo base em R$ quando não usa importação em USD */
  base_cost_brl?: number | null
  /** Valor do produto em USD (importação) */
  import_usd?: number | null
  /** Cotação R$ por 1 USD */
  usd_rate?: number | null
  freight_cost?: number | null
  carrier_cost?: number | null
  nfe_cost?: number | null
}

function nz(v: unknown): number {
  if (v === null || v === undefined || v === '') {
    return 0
  }
  const x = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(x) || x < 0) {
    return 0
  }
  return x
}

/** Base em R$: prioriza USD × cotação quando ambos preenchidos; senão custo base R$. */
export function computeBaseBrl(input: ProductCostBreakdownInput): number {
  const usd = nz(input.import_usd)
  const rate = nz(input.usd_rate)
  if (usd > 0 && rate > 0) {
    return usd * rate
  }
  return nz(input.base_cost_brl)
}

export function computeTotalCost(input: ProductCostBreakdownInput): number {
  return (
    computeBaseBrl(input)
    + nz(input.freight_cost)
    + nz(input.carrier_cost)
    + nz(input.nfe_cost)
  )
}

export function computeProfitMetrics(salePrice: number, totalCost: number) {
  const p = nz(salePrice)
  const c = nz(totalCost)
  const profit = p - c
  const marginPct = p > 0 ? (profit / p) * 100 : 0
  const markupPct = c > 0 ? (profit / c) * 100 : 0
  return { profit, marginPct, markupPct }
}

export function parseCostBreakdownFromSpecs(specifications: unknown): ProductCostBreakdownInput | null {
  if (!specifications || typeof specifications !== 'object') {
    return null
  }
  const o = specifications as Record<string, unknown>
  const raw = o.cost_breakdown
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const b = raw as Record<string, unknown>
  return {
    base_cost_brl: b.base_cost_brl != null ? Number(b.base_cost_brl) : null,
    import_usd: b.import_usd != null ? Number(b.import_usd) : null,
    usd_rate: b.usd_rate != null ? Number(b.usd_rate) : null,
    freight_cost: b.freight_cost != null ? Number(b.freight_cost) : null,
    carrier_cost: b.carrier_cost != null ? Number(b.carrier_cost) : null,
    nfe_cost: b.nfe_cost != null ? Number(b.nfe_cost) : null,
  }
}

export function hasAnyCostBreakdownInput(b: ProductCostBreakdownInput | undefined | null): boolean {
  if (!b) {
    return false
  }
  const keys: (keyof ProductCostBreakdownInput)[] = [
    'base_cost_brl',
    'import_usd',
    'usd_rate',
    'freight_cost',
    'carrier_cost',
    'nfe_cost',
  ]
  return keys.some((k) => {
    const v = b[k]
    return v != null && v !== '' && Number(v) > 0
  })
}

export function mergeSpecificationsWithCostBreakdown(
  existing: Record<string, unknown> | null | undefined,
  breakdown: ProductCostBreakdownInput,
): Record<string, unknown> {
  const base = existing && typeof existing === 'object' && !Array.isArray(existing)
    ? { ...existing }
    : {}
  base.cost_breakdown = {
    base_cost_brl: breakdown.base_cost_brl ?? null,
    import_usd: breakdown.import_usd ?? null,
    usd_rate: breakdown.usd_rate ?? null,
    freight_cost: breakdown.freight_cost ?? null,
    carrier_cost: breakdown.carrier_cost ?? null,
    nfe_cost: breakdown.nfe_cost ?? null,
  }
  return base
}
