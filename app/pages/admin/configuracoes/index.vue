<script setup lang="ts">
/**
 * Configurações - Hub de configurações com design premium
 */

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Configurações',
})

const settingsGroups = [
  {
    title: 'Geral',
    items: [
      {
        title: 'Empresa',
        description: 'Dados da empresa e informações gerais',
        icon: 'lucide:building',
        to: '/admin/configuracoes/empresa',
        color: 'blue',
      },
      {
        title: 'Meu Perfil',
        description: 'Dados pessoais e senha',
        icon: 'lucide:user',
        to: '/admin/configuracoes/perfil',
        color: 'violet',
      },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      {
        title: 'Categorias',
        description: 'Gerenciar categorias de produtos',
        icon: 'lucide:folder',
        to: '/admin/configuracoes/categorias',
        color: 'amber',
      },
      {
        title: 'Marcas',
        description: 'Gerenciar marcas de produtos',
        icon: 'lucide:award',
        to: '/admin/configuracoes/marcas',
        color: 'emerald',
      },
    ],
  },
  {
    title: 'Vendas',
    items: [
      {
        title: 'Formas de Pagamento',
        description: 'Configurar formas de pagamento',
        icon: 'lucide:credit-card',
        to: '/admin/configuracoes/pagamentos',
        color: 'blue',
      },
      {
        title: 'Impostos',
        description: 'Configurar alíquotas e tributação',
        icon: 'lucide:percent',
        to: '/admin/configuracoes/impostos',
        color: 'rose',
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Notificações',
        description: 'Configurar notificações e alertas',
        icon: 'lucide:bell',
        to: '/admin/configuracoes/notificacoes',
        color: 'amber',
      },
      {
        title: 'Integrações',
        description: 'APIs e serviços externos',
        icon: 'lucide:plug',
        to: '/admin/configuracoes/integracoes',
        color: 'violet',
      },
      {
        title: 'Backup',
        description: 'Backup e restauração de dados',
        icon: 'lucide:database',
        to: '/admin/configuracoes/backup',
        color: 'emerald',
      },
    ],
  },
]

const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'group-hover:bg-blue-100' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', hover: 'group-hover:bg-violet-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', hover: 'group-hover:bg-amber-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:bg-emerald-100' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', hover: 'group-hover:bg-rose-100' },
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <!-- Header -->
    <AppPageHeader
      title="Configurações"
      description="Gerencie as configurações do sistema"
      :breadcrumbs="[{ label: 'Configurações' }]"
    />

    <!-- Settings Groups -->
    <div class="space-y-8">
      <div v-for="group in settingsGroups" :key="group.title">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          {{ group.title }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="item in group.items"
            :key="item.title"
            :to="item.to"
            class="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                :class="[colorClasses[item.color].bg, colorClasses[item.color].hover]"
              >
                <Icon :name="item.icon" class="w-6 h-6" :class="colorClasses[item.color].icon" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-slate-500 mt-0.5">{{ item.description }}</p>
              </div>
              <Icon name="lucide:chevron-right" class="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-red-50 rounded-2xl p-6 border border-red-100">
      <h2 class="text-lg font-semibold text-red-900 mb-2">Zona de Perigo</h2>
      <p class="text-sm text-red-700 mb-4">
        Ações irreversíveis que afetam todo o sistema.
      </p>
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          Limpar Cache
        </button>
        <button class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          Resetar Configurações
        </button>
      </div>
    </div>
  </div>
</template>
