<script setup lang="ts">
/**
 * AppSidebar
 *
 * Sidebar principal do sistema com design premium e responsivo
 */

import type { SidebarItem } from '~/types'

interface Props {
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
})

const { collapsed, mobileOpen, toggle, closeMobile } = useSidebar()
const { signOut } = useAuth()
const route = useRoute()
const loggingOut = ref(false)

async function handleSignOut() {
  if (loggingOut.value) {
    return
  }
  loggingOut.value = true
  closeMobile()
  try {
    await signOut()
  }
  catch (error) {
    console.error('Erro ao sair:', error)
  }
  finally {
    loggingOut.value = false
  }
}

const menuGroups = [
  {
    title: 'Principal',
    items: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'lucide:layout-dashboard',
        to: '/admin/dashboard',
      },
    ],
  },
  {
    title: 'Vendas',
    items: [
      {
        key: 'clientes',
        label: 'Clientes',
        icon: 'lucide:users',
        to: '/admin/clientes',
      },
      {
        key: 'vendas',
        label: 'Vendas',
        icon: 'lucide:shopping-cart',
        to: '/admin/vendas',
      },
      {
        key: 'pedidos',
        label: 'Pedidos',
        icon: 'lucide:clipboard-list',
        to: '/admin/pedidos',
      },
      {
        key: 'produtos',
        label: 'Produtos',
        icon: 'lucide:package',
        to: '/admin/produtos',
      },
      {
        key: 'categorias',
        label: 'Categorias',
        icon: 'lucide:folder',
        to: '/admin/produtos/categorias',
      },
      {
        key: 'marcas',
        label: 'Marcas',
        icon: 'lucide:award',
        to: '/admin/produtos/marcas',
      },
      {
        key: 'estoque',
        label: 'Estoque',
        icon: 'lucide:boxes',
        to: '/admin/estoque',
      },
    ],
  },
  {
    title: 'Operações',
    items: [
      {
        key: 'fornecedores',
        label: 'Fornecedores',
        icon: 'lucide:truck',
        to: '/admin/fornecedores',
      },
      {
        key: 'financeiro',
        label: 'Financeiro',
        icon: 'lucide:wallet',
        to: '/admin/financeiro',
      },
      {
        key: 'garantias',
        label: 'Garantias',
        icon: 'lucide:shield-check',
        to: '/admin/garantias',
      },
      {
        key: 'assistencia',
        label: 'Assistência',
        icon: 'lucide:wrench',
        to: '/admin/assistencia',
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        key: 'relatorios',
        label: 'Relatórios',
        icon: 'lucide:bar-chart-3',
        to: '/admin/relatorios',
      },
      {
        key: 'usuarios',
        label: 'Usuários',
        icon: 'lucide:user-cog',
        to: '/admin/usuarios',
      },
      {
        key: 'permissoes',
        label: 'Permissões',
        icon: 'lucide:shield',
        to: '/admin/permissoes',
      },
      {
        key: 'configuracoes',
        label: 'Configurações',
        icon: 'lucide:settings',
        to: '/admin/configuracoes',
      },
    ],
  },
]

const isActive = (item: SidebarItem) => {
  if (!item.to) return false
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const handleNavigation = () => {
  if (props.isMobile) {
    closeMobile()
  }
}

const sidebarClasses = computed(() => {
  if (props.isMobile) {
    return [
      'fixed inset-y-0 left-0 z-50 w-72',
      'transform transition-transform duration-300 ease-out',
      mobileOpen.value ? 'translate-x-0' : '-translate-x-full',
    ]
  }
  return [
    'fixed inset-y-0 left-0 z-40',
    'transition-all duration-300 ease-out',
    collapsed.value ? 'w-20' : 'w-72',
  ]
})
</script>

<template>
  <aside
    :class="sidebarClasses"
    class="flex flex-col bg-slate-900 border-r border-slate-800/80"
  >
    <!-- Logo Area -->
    <div class="flex items-center h-[72px] px-5 border-b border-white/5">
      <NuxtLink
        to="/admin/dashboard"
        class="flex items-center gap-3 group"
        @click="handleNavigation"
      >
        <!-- Logo Icon -->
        <div class="relative flex-shrink-0">
          <div class="w-9 h-9 rounded-md bg-primary-600 flex items-center justify-center transition-opacity group-hover:opacity-90">
            <Icon name="lucide:smartphone" class="w-[18px] h-[18px] text-white" />
          </div>
        </div>

        <!-- Logo Text -->
        <div v-if="!collapsed || isMobile" class="flex-1 min-w-0">
          <h1 class="text-[15px] font-semibold text-white tracking-tight">
            Eleve Imports
          </h1>
          <p class="text-[11px] text-slate-500">
            Sistema de Gestão
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
      <div v-for="group in menuGroups" :key="group.title">
        <!-- Group Title -->
        <h3
          v-if="!collapsed || isMobile"
          class="px-3 mb-1.5 text-[11px] font-medium text-slate-500"
        >
          {{ group.title }}
        </h3>
        <div v-else class="h-px bg-slate-700/50 mx-2 mb-3" />

        <!-- Menu Items -->
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.key">
            <NuxtLink
              :to="item.to"
              :title="collapsed && !isMobile ? item.label : undefined"
              class="relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 group"
              :class="[
                isActive(item)
                  ? 'bg-white/[0.08] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]',
              ]"
              @click="handleNavigation"
            >
              <Icon
                :name="item.icon"
                class="flex-shrink-0 w-[18px] h-[18px]"
                :class="isActive(item) ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'"
              />

              <!-- Label -->
              <span
                v-if="!collapsed || isMobile"
                class="flex-1 truncate"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div class="border-t border-white/5 p-3">
      <!-- User Card -->
      <div
        v-if="!collapsed || isMobile"
        class="flex items-center gap-3 p-2.5 rounded-md bg-white/[0.05] mb-2"
      >
        <div class="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-white text-xs font-medium">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">Administrador</p>
          <p class="text-xs text-slate-400 truncate">admin@eleve.com</p>
        </div>
        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          :disabled="loggingOut"
          :title="loggingOut ? 'Saindo…' : 'Sair da conta'"
          @click="handleSignOut"
        >
          <Icon name="lucide:log-out" class="w-4 h-4" />
        </button>
      </div>

      <!-- Collapse Button (Desktop only) -->
      <button
        v-if="!isMobile"
        class="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
        @click="toggle"
      >
        <Icon
          :name="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
          class="w-5 h-5"
        />
        <span v-if="!collapsed">Recolher</span>
      </button>
    </div>
  </aside>
</template>
