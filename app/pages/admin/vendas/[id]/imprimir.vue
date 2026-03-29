<script setup lang="ts">
/**
 * Documento para impressão: pedido de venda / comprovante (uso interno + assinatura do cliente).
 * Abra em nova aba e use Ctrl+P ou o botão "Imprimir".
 */
import type { Order } from '~~/domains/vendas/types'
import type { OrderStatus, PaymentMethod, PaymentStatus } from '~/types'

definePageMeta({
  layout: false,
})

const route = useRoute()
const config = useRuntimeConfig()

const orderId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] ?? '' : String(raw ?? '')
})

const storeName = computed(() => config.public.appName ?? 'Eleve Imports')

const { format } = useCurrency()
const { formatDateTime } = useDateFormat()
const service = useOrdersService()

const order = ref<Order | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Em separação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  returned: 'Devolvido',
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  partial: 'Parcial',
  refunded: 'Reembolsado',
  failed: 'Falhou',
  cancelled: 'Cancelado',
}

const methodLabels: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  pix: 'PIX',
  transfer: 'Transferência',
  installment: 'Parcelado',
  check: 'Cheque',
  other: 'Outro',
}

function wantsAutoPrintFromQuery(): boolean {
  const g = route.query.gerar
  if (Array.isArray(g)) {
    return g.some(v => v === '1' || v === 'true')
  }
  return g === '1' || g === 'true'
}

const load = async () => {
  if (!orderId.value) {
    return
  }
  loading.value = true
  loadError.value = null
  try {
    order.value = await service.getById(orderId.value)
  }
  catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Pedido não encontrado'
    order.value = null
  }
  finally {
    loading.value = false
    if (
      import.meta.client
      && wantsAutoPrintFromQuery()
      && order.value
      && !loadError.value
    ) {
      nextTick(() => {
        window.print()
      })
    }
  }
}

watch(orderId, () => {
  void load()
}, { immediate: true })

useHead({
  title: computed(() =>
    order.value?.number ? `Gerar impressão — ${order.value.number}` : 'Gerar impressão',
  ),
})

function printPage() {
  if (import.meta.client) {
    window.print()
  }
}
</script>

<template>
  <div class="print-root min-h-screen bg-slate-100 text-slate-900 print:bg-white print:min-h-0">
    <!-- Barra de ação (não imprime) -->
    <div
      class="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm"
    >
      <p class="text-sm text-slate-600">
        Gere o documento para o cliente assinar. Na janela que abrir, escolha impressora ou <strong class="font-medium text-slate-800">Salvar como PDF</strong>.
      </p>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          :to="`/admin/vendas/${orderId}`"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Voltar ao pedido
        </NuxtLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          @click="printPage"
        >
          <Icon name="lucide:printer" class="w-4 h-4" />
          Gerar impressão
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-[210mm] px-4 py-8 print:px-0 print:py-6 print:max-w-none">
      <div v-if="loading" class="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Carregando pedido…
      </div>
      <div
        v-else-if="loadError"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800"
      >
        {{ loadError }}
      </div>

      <article
        v-else-if="order"
        class="rounded-lg border border-slate-300 bg-white p-8 shadow-sm print:border-0 print:shadow-none print:rounded-none"
      >
        <header class="border-b border-slate-200 pb-6 text-center print:pb-4">
          <h1 class="text-xl font-semibold tracking-tight">
            {{ storeName }}
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Pedido de venda / comprovante
          </p>
          <p class="mt-4 text-lg font-semibold">
            Pedido {{ order.number }}
          </p>
          <p class="text-sm text-slate-600">
            Emitido em {{ formatDateTime(order.created_at) }}
          </p>
        </header>

        <section class="mt-6 grid gap-6 border-b border-slate-100 pb-6 md:grid-cols-2 print:grid-cols-2">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cliente
            </h2>
            <p class="mt-2 font-medium">
              {{ order.customer?.name || '—' }}
            </p>
            <p v-if="order.customer?.phone" class="text-sm text-slate-600">
              Tel. {{ order.customer.phone }}
            </p>
            <p v-if="order.customer?.email" class="text-sm text-slate-600">
              {{ order.customer.email }}
            </p>
          </div>
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Situação
            </h2>
            <p class="mt-2 text-sm">
              <span class="font-medium">Pedido:</span> {{ statusLabels[order.status] }}
            </p>
            <p class="text-sm">
              <span class="font-medium">Pagamento:</span> {{ paymentStatusLabels[order.payment_status] }}
            </p>
            <p v-if="order.payment_method" class="text-sm">
              <span class="font-medium">Forma:</span> {{ methodLabels[order.payment_method] }}
            </p>
            <p v-if="order.seller?.name" class="mt-2 text-sm">
              <span class="font-medium">Atendente:</span> {{ order.seller.name }}
            </p>
          </div>
        </section>

        <section class="mt-6">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Itens
          </h2>
          <table class="mt-3 w-full border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-xs text-slate-500">
                <th class="py-2 pr-2 font-medium">
                  Descrição
                </th>
                <th class="py-2 px-2 text-right font-medium">
                  Qtd
                </th>
                <th class="py-2 px-2 text-right font-medium">
                  Unit.
                </th>
                <th class="py-2 pl-2 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in order.items"
                :key="item.id"
                class="border-b border-slate-100"
              >
                <td class="py-2 pr-2 align-top">
                  <span class="font-medium">{{ item.product_name }}</span>
                  <span v-if="item.sku" class="block text-xs text-slate-500">SKU: {{ item.sku }}</span>
                  <span v-if="item.imei" class="block text-xs text-slate-500">IMEI: {{ item.imei }}</span>
                </td>
                <td class="py-2 px-2 text-right tabular-nums">
                  {{ item.quantity }}
                </td>
                <td class="py-2 px-2 text-right tabular-nums">
                  {{ format(item.unit_price) }}
                </td>
                <td class="py-2 pl-2 text-right font-medium tabular-nums">
                  {{ format(item.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <dl class="w-full max-w-xs space-y-1 text-sm">
            <div class="flex justify-between">
              <dt class="text-slate-600">
                Subtotal
              </dt>
              <dd class="tabular-nums">
                {{ format(order.subtotal) }}
              </dd>
            </div>
            <div v-if="order.discount > 0" class="flex justify-between">
              <dt class="text-slate-600">
                Desconto
              </dt>
              <dd class="tabular-nums">
                − {{ format(order.discount) }}
              </dd>
            </div>
            <div v-if="order.shipping > 0" class="flex justify-between">
              <dt class="text-slate-600">
                Frete
              </dt>
              <dd class="tabular-nums">
                {{ format(order.shipping) }}
              </dd>
            </div>
            <div class="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd class="tabular-nums">
                {{ format(order.total) }}
              </dd>
            </div>
          </dl>
        </section>

        <section v-if="order.notes" class="mt-6 rounded-md bg-slate-50 p-4 text-sm print:bg-transparent print:p-0">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Observações
          </h2>
          <p class="mt-2 whitespace-pre-wrap text-slate-700">
            {{ order.notes }}
          </p>
        </section>

        <section class="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-700">
          <p class="mb-6 leading-relaxed">
            Declaro ter recebido os produtos discriminados acima em perfeitas condições, conferidos na minha presença,
            e estar ciente das condições de garantia informadas pela loja, quando aplicável.
          </p>
          <div class="grid gap-10 pt-4 md:grid-cols-2 print:grid-cols-2 print:gap-8">
            <div>
              <div class="mb-8 border-b border-slate-900 print:mb-10" />
              <p class="text-center text-slate-600">
                Assinatura do cliente
              </p>
              <p class="mt-1 text-center text-xs text-slate-500">
                Nome legível: _______________________________
              </p>
            </div>
            <div>
              <div class="mb-8 border-b border-slate-900 print:mb-10" />
              <p class="text-center text-slate-600">
                Assinatura do representante da loja
              </p>
              <p class="mt-1 text-center text-xs text-slate-500">
                Data: ____ / ____ / ________
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .print-root {
    background: white !important;
  }
}
</style>
