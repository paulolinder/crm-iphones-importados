<script setup lang="ts">
/**
 * Relatórios - Central de relatórios com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Relatórios',
})

const reportCategories = [
  {
    title: 'Vendas',
    icon: 'lucide:shopping-cart',
    color: 'blue',
    reports: [
      { title: 'Vendas por Período', description: 'Análise de vendas por data', icon: 'lucide:calendar' },
      { title: 'Vendas por Produto', description: 'Produtos mais vendidos', icon: 'lucide:package' },
      { title: 'Vendas por Cliente', description: 'Clientes com maior volume', icon: 'lucide:users' },
      { title: 'Vendas por Vendedor', description: 'Performance da equipe', icon: 'lucide:user' },
    ],
  },
  {
    title: 'Estoque',
    icon: 'lucide:boxes',
    color: 'emerald',
    reports: [
      { title: 'Posição de Estoque', description: 'Situação atual do estoque', icon: 'lucide:list' },
      { title: 'Movimentação', description: 'Entradas e saídas', icon: 'lucide:arrow-left-right' },
      { title: 'Produtos Críticos', description: 'Estoque baixo ou zerado', icon: 'lucide:alert-triangle' },
    ],
  },
  {
    title: 'Financeiro',
    icon: 'lucide:wallet',
    color: 'violet',
    reports: [
      { title: 'Fluxo de Caixa', description: 'Entradas e saídas financeiras', icon: 'lucide:trending-up' },
      { title: 'Contas a Receber', description: 'Recebíveis por período', icon: 'lucide:arrow-down-circle' },
      { title: 'Contas a Pagar', description: 'Despesas por período', icon: 'lucide:arrow-up-circle' },
      { title: 'DRE', description: 'Demonstrativo de resultados', icon: 'lucide:file-text' },
    ],
  },
]

const { info: toastInfo } = useToast()

function reportActionSoon(reportTitle: string, kind: 'view' | 'pdf') {
  toastInfo(
    'Relatório em desenvolvimento',
    kind === 'pdf'
      ? `Geração de PDF de "${reportTitle}" em breve.`
      : `Visualização de "${reportTitle}" em breve.`,
  )
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Relatórios"
      description="Central de relatórios e analytics"
      :breadcrumbs="[{ label: 'Relatórios' }]"
    />

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:file-text" class="w-6 h-6 text-blue-200" />
          <span class="text-sm font-medium text-blue-100">Relatórios Gerados</span>
        </div>
        <p class="text-3xl font-bold">128</p>
        <p class="text-sm text-blue-200 mt-1">Este mês</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:download" class="w-6 h-6 text-slate-400" />
          <span class="text-sm font-medium text-slate-500">Downloads</span>
        </div>
        <p class="text-3xl font-bold text-slate-900">45</p>
        <p class="text-sm text-slate-400 mt-1">Este mês</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-3">
          <Icon name="lucide:clock" class="w-6 h-6 text-slate-400" />
          <span class="text-sm font-medium text-slate-500">Último Gerado</span>
        </div>
        <p class="text-lg font-bold text-slate-900">Vendas por Período</p>
        <p class="text-sm text-slate-400 mt-1">Há 2 horas</p>
      </div>
    </div>

    <!-- Report Categories -->
    <div class="space-y-8">
      <div v-for="category in reportCategories" :key="category.title">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="colorClasses[category.color].bg"
          >
            <Icon :name="category.icon" class="w-5 h-5" :class="colorClasses[category.color].text" />
          </div>
          <h2 class="text-lg font-semibold text-slate-900">{{ category.title }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="report in category.reports"
            :key="report.title"
            class="group bg-white rounded-2xl p-5 shadow-sm border hover:shadow-lg hover:border-slate-200 transition-all duration-300 cursor-pointer"
            :class="colorClasses[category.color].border"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110"
                :class="colorClasses[category.color].bg"
              >
                <Icon :name="report.icon" class="w-5 h-5" :class="colorClasses[category.color].text" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {{ report.title }}
                </h3>
                <p class="text-sm text-slate-500 mt-0.5">{{ report.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
              <button
                type="button"
                class="text-xs text-slate-500 hover:text-slate-700 font-medium"
                @click="reportActionSoon(report.title, 'view')"
              >
                Visualizar
              </button>
              <button
                type="button"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                @click="reportActionSoon(report.title, 'pdf')"
              >
                Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
