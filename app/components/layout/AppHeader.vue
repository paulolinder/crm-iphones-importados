<script setup lang="ts">
/**
 * AppHeader
 *
 * Header principal do sistema com design premium e responsivo
 */

interface Props {
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
})

const { collapsed, openMobile } = useSidebar()
const { signOut } = useAuth()
const showUserMenu = ref(false)
const loggingOut = ref(false)
const showNotifications = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

const userMenuRef = ref<HTMLElement>()
const notificationsRef = ref<HTMLElement>()

const {
  items: activityItems,
  unreadCount,
  loading: activityLoading,
  error: activityError,
  load: loadActivityFeed,
  markAllRead: markActivityFeedRead,
  readLastSeenFromStorage,
} = useAdminActivityFeed()

onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

onClickOutside(notificationsRef, () => {
  showNotifications.value = false
})

const user = reactive({
  name: 'Administrador',
  email: 'admin@eleveimports.com',
  role: 'Super Admin',
  avatar: '',
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    readLastSeenFromStorage()
    void loadActivityFeed()
  }
}

const headerClasses = computed(() => {
  if (props.isMobile) {
    return 'left-0'
  }
  return collapsed.value ? 'lg:left-20' : 'lg:left-72'
})

const quickActions = [
  { icon: 'lucide:plus', label: 'Nova Venda', to: '/admin/vendas/nova', color: 'blue' },
  { icon: 'lucide:user-plus', label: 'Novo Cliente', to: '/admin/clientes/novo', color: 'emerald' },
  { icon: 'lucide:package-plus', label: 'Novo Produto', to: '/admin/produtos/novo', color: 'purple' },
]

async function handleSignOut() {
  if (loggingOut.value) {
    return
  }
  loggingOut.value = true
  showUserMenu.value = false
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
</script>

<template>
  <header
    class="fixed top-0 right-0 h-16 lg:h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-30 transition-all duration-300"
    :class="headerClasses"
  >
    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Button -->
      <button
        v-if="isMobile"
        class="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        @click="openMobile"
      >
        <Icon name="lucide:menu" class="w-6 h-6" />
      </button>

      <!-- Search Bar -->
      <div class="hidden md:flex items-center">
        <div class="relative group">
          <Icon
            name="lucide:search"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar clientes, produtos, pedidos..."
            class="w-72 lg:w-96 pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Mobile Search Button -->
      <button
        v-if="isMobile"
        class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
        @click="showSearch = !showSearch"
      >
        <Icon name="lucide:search" class="w-5 h-5" />
      </button>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-1 lg:gap-2">
      <!-- Quick Actions (Desktop) -->
      <div class="hidden xl:flex items-center gap-1 mr-2 pr-3 border-r border-slate-200">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          :title="action.label"
          class="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Icon :name="action.icon" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Notifications -->
      <div ref="notificationsRef" class="relative">
        <button
          type="button"
          class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          @click="toggleNotifications"
        >
          <Icon name="lucide:bell" class="w-5 h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-semibold text-white bg-danger-600 rounded-full"
          >
            {{ unreadCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-1.5 w-80 lg:w-96 bg-white rounded-lg border border-slate-200 overflow-hidden z-50"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 gap-2">
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-slate-900">Atividade recente</h3>
                <p class="text-xs text-slate-500 mt-0.5 truncate">
                  <template v-if="activityError">Erro ao carregar</template>
                  <template v-else-if="unreadCount === 0">Fonte: auditoria · nada novo desde a última leitura</template>
                  <template v-else>Fonte: auditoria · {{ unreadCount }} {{ unreadCount === 1 ? 'não lida' : 'não lidas' }}</template>
                </p>
              </div>
              <button
                v-if="!activityError && activityItems.length"
                type="button"
                class="text-xs text-primary-600 hover:text-primary-700 font-medium shrink-0"
                @click="markActivityFeedRead"
              >
                Marcar lidas
              </button>
            </div>

            <!-- List -->
            <div class="max-h-80 overflow-y-auto">
              <div v-if="activityLoading" class="px-4 py-8 text-center text-sm text-slate-500">
                Carregando…
              </div>
              <div
                v-else-if="activityError"
                class="px-4 py-6 text-sm text-amber-800 bg-amber-50 border-b border-amber-100"
              >
                {{ activityError }}. Verifique RLS em <code class="text-xs">audit_logs</code> ou a página
                <NuxtLink to="/admin/notificacoes" class="underline font-medium" @click="showNotifications = false">Notificações</NuxtLink>.
              </div>
              <template v-else>
                <NuxtLink
                  v-for="n in activityItems"
                  :key="n.id"
                  to="/admin/notificacoes"
                  class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  :class="n.read ? 'opacity-60' : ''"
                  @click="showNotifications = false"
                >
                  <div class="flex-shrink-0 w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                    <Icon :name="n.icon" class="w-[18px] h-[18px]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 leading-snug">{{ n.title }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ n.subtitle }}</p>
                  </div>
                </NuxtLink>
                <div
                  v-if="!activityItems.length"
                  class="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Nenhum evento no audit log ainda.
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="px-5 py-2.5 border-t border-slate-100 bg-slate-50">
              <NuxtLink
                to="/admin/notificacoes"
                class="block w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
                @click="showNotifications = false"
              >
                Ver todas as notificações
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Menu -->
      <div ref="userMenuRef" class="relative">
        <button
          class="flex items-center gap-2.5 p-1.5 lg:pl-2.5 lg:pr-3 hover:bg-slate-100 rounded-lg transition-colors"
          @click="showUserMenu = !showUserMenu"
        >
          <!-- Avatar -->
          <div class="relative">
            <div class="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
              {{ user.name.charAt(0) }}
            </div>
          </div>

          <!-- Info (Desktop) -->
          <div class="hidden lg:block text-left">
            <p class="text-sm font-semibold text-slate-900">{{ user.name }}</p>
            <p class="text-xs text-slate-500">{{ user.role }}</p>
          </div>
          <Icon name="lucide:chevron-down" class="w-4 h-4 text-slate-400 hidden lg:block" />
        </button>

        <!-- User Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-1.5 w-64 bg-white rounded-lg border border-slate-200 overflow-hidden z-50"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-md bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {{ user.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-slate-900">{{ user.name }}</p>
                  <p class="text-sm text-slate-500">{{ user.email }}</p>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-2">
              <NuxtLink
                to="/admin/configuracoes/perfil"
                class="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                @click="showUserMenu = false"
              >
                <Icon name="lucide:user" class="w-4 h-4 text-slate-400" />
                Meu Perfil
              </NuxtLink>
              <NuxtLink
                to="/admin/configuracoes"
                class="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                @click="showUserMenu = false"
              >
                <Icon name="lucide:settings" class="w-4 h-4 text-slate-400" />
                Configurações
              </NuxtLink>
              <NuxtLink
                to="/admin/relatorios"
                class="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                @click="showUserMenu = false"
              >
                <Icon name="lucide:bar-chart-3" class="w-4 h-4 text-slate-400" />
                Relatórios
              </NuxtLink>
            </div>

            <!-- Logout -->
            <div class="border-t border-slate-100 py-2">
              <button
                type="button"
                class="flex items-center gap-3 px-5 py-2.5 w-full text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                :disabled="loggingOut"
                @click="handleSignOut"
              >
                <Icon name="lucide:log-out" class="w-4 h-4" />
                {{ loggingOut ? 'Saindo…' : 'Sair da conta' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
