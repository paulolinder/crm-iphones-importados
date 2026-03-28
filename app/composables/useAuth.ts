/**
 * useAuth
 *
 * Composable para gerenciar autenticação
 */

import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

const authState = reactive<AuthState>({
  user: null,
  loading: true,
  initialized: false,
})

export function useAuth() {
  const { client, signIn: supabaseSignIn, signOut: supabaseSignOut } = useSupabase()
  const router = useRouter()

  const user = computed(() => authState.user)
  const isAuthenticated = computed(() => !!authState.user)
  const isLoading = computed(() => authState.loading)
  const isInitialized = computed(() => authState.initialized)

  const initialize = async () => {
    if (authState.initialized) return

    authState.loading = true

    try {
      const { data: { session } } = await client.auth.getSession()
      authState.user = session?.user ?? null

      client.auth.onAuthStateChange((_event, session) => {
        authState.user = session?.user ?? null
      })
    }
    catch (error) {
      console.error('Erro ao inicializar autenticação:', error)
    }
    finally {
      authState.loading = false
      authState.initialized = true
    }
  }

  const signIn = async (email: string, password: string) => {
    authState.loading = true

    try {
      const data = await supabaseSignIn(email, password)
      authState.user = data.user
      router.push('/admin/dashboard')
      return data
    }
    finally {
      authState.loading = false
    }
  }

  const signOut = async () => {
    authState.loading = true

    try {
      await supabaseSignOut()
      authState.user = null
      router.push('/login')
    }
    finally {
      authState.loading = false
    }
  }

  const checkPermission = (permission: string): boolean => {
    if (!authState.user) return false
    // TODO: Implementar lógica de permissões quando o sistema de roles for definido
    return true
  }

  const hasRole = (role: string): boolean => {
    if (!authState.user) return false
    // TODO: Implementar lógica de roles
    return true
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    initialize,
    signIn,
    signOut,
    checkPermission,
    hasRole,
  }
}
