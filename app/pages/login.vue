<script setup lang="ts">
/**
 * Login - Página de autenticação com design premium
 */

definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Login',
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const { signIn, isLoading } = useAuth()

function formatLoginError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  if (/invalid login credentials|invalid_credentials/i.test(raw)) {
    return 'E-mail ou senha incorretos. Se o banco ainda não tem nenhum usuário, crie um no Supabase (Authentication → Users) ou rode o script supabase/scripts/create_demo_admin_user.sql.'
  }
  return raw || 'Não foi possível entrar. Tente novamente.'
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  error.value = ''

  try {
    await signIn(email.value, password.value)
    await navigateTo('/admin/dashboard')
  } catch (err) {
    error.value = formatLoginError(err)
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Brand -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 w-full">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Icon name="lucide:smartphone" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Eleve Imports</h1>
            <p class="text-sm text-slate-400">Sistema de Gestão</p>
          </div>
        </div>

        <!-- Center Content -->
        <div class="flex-1 flex flex-col justify-center max-w-md">
          <h2 class="text-4xl font-bold text-white mb-4">
            Gerencie seu negócio com
            <span class="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              eficiência
            </span>
          </h2>
          <p class="text-lg text-slate-400 leading-relaxed">
            Controle de vendas, estoque, clientes e financeiro em um só lugar.
            Sistema completo para lojas de iPhones e produtos importados.
          </p>

          <!-- Features -->
          <div class="mt-8 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Icon name="lucide:check" class="w-4 h-4 text-emerald-400" />
              </div>
              <span class="text-slate-300">Controle de estoque por IMEI/Serial</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Icon name="lucide:check" class="w-4 h-4 text-emerald-400" />
              </div>
              <span class="text-slate-300">Gestão completa de garantias</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Icon name="lucide:check" class="w-4 h-4 text-emerald-400" />
              </div>
              <span class="text-slate-300">Relatórios e dashboards em tempo real</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-sm text-slate-500">
          &copy; 2024 Eleve Imports. Todos os direitos reservados.
        </p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Icon name="lucide:smartphone" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900">Eleve Imports</h1>
            <p class="text-sm text-slate-500">Sistema de Gestão</p>
          </div>
        </div>

        <!-- Form Header -->
        <div class="text-center lg:text-left mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p class="text-slate-500">
            Entre com suas credenciais para acessar o sistema.
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
        >
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email -->
          <div>
            <label for="email" class="form-label">Email</label>
            <div class="relative">
              <Icon
                name="lucide:mail"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="form-input pl-12"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="form-label">Senha</label>
            <div class="relative">
              <Icon
                name="lucide:lock"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="form-input pl-12 pr-12"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                @click="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="form-checkbox"
                :disabled="isLoading"
              />
              <span class="text-sm text-slate-600">Lembrar de mim</span>
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Esqueceu a senha?
            </NuxtLink>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              Entrar
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-slate-100 rounded-xl">
          <p class="text-xs text-slate-500 text-center mb-2">Credenciais de demonstração</p>
          <div class="flex items-center justify-center gap-4 text-sm">
            <span class="text-slate-600">admin@eleveimports.com</span>
            <span class="text-slate-400">|</span>
            <span class="text-slate-600">123456</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
