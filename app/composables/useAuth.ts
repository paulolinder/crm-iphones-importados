/**
 * useAuth
 *
 * Camada central de autenticação, perfil, papéis e permissões.
 */

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import type { Tables } from '~/lib/supabase/types'

type Profile = Tables<'profiles'>
type Role = Tables<'roles'>
type Permission = Tables<'permissions'>

interface RoleWithRelation {
  role_id: string
}

interface PermissionRelation {
  permission_id: string
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: Role[]
  permissions: Permission[]
  loading: boolean
  initialized: boolean
}

const authState = reactive<AuthState>({
  user: null,
  session: null,
  profile: null,
  roles: [],
  permissions: [],
  loading: true,
  initialized: false,
})

let authSubscriptionInitialized = false

export function useAuth() {
  const { client, getSession, signIn: supabaseSignIn, signOut: supabaseSignOut } = useSupabase()
  const router = useRouter()

  const user = computed(() => authState.user)
  const session = computed(() => authState.session)
  const profile = computed(() => authState.profile)
  const roles = computed(() => authState.roles)
  const permissions = computed(() => authState.permissions)
  const isAuthenticated = computed(() => !!authState.user && !!authState.session)
  const isLoading = computed(() => authState.loading)
  const isInitialized = computed(() => authState.initialized)

  const resetState = () => {
    authState.user = null
    authState.session = null
    authState.profile = null
    authState.roles = []
    authState.permissions = []
  }

  const loadAccessContext = async (userId: string) => {
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      throw profileError
    }

    authState.profile = profileData

    const { data: userRolesData, error: userRolesError } = await client
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)

    if (userRolesError) {
      throw userRolesError
    }

    const rolesData = (userRolesData ?? []) as RoleWithRelation[]
    const roleIds = rolesData.map(item => item.role_id)

    if (roleIds.length) {
      const { data: rolesRows, error: rolesError } = await client
        .from('roles')
        .select('*')
        .in('id', roleIds)

      if (rolesError) {
        throw rolesError
      }

      authState.roles = rolesRows ?? []
    }
    else {
      authState.roles = []
    }

    if (!roleIds.length) {
      authState.permissions = []
      return
    }

    const { data: rolePermissionsData, error: rolePermissionsError } = await client
      .from('role_permissions')
      .select('permission_id')
      .in('role_id', roleIds)

    if (rolePermissionsError) {
      throw rolePermissionsError
    }

    const permissionIds = Array.from(new Set(
      ((rolePermissionsData ?? []) as PermissionRelation[]).map(item => item.permission_id),
    ))

    if (!permissionIds.length) {
      authState.permissions = []
      return
    }

    const { data: permissionsData, error: permissionsError } = await client
      .from('permissions')
      .select('*')
      .in('id', permissionIds)

    if (permissionsError) {
      throw permissionsError
    }

    authState.permissions = permissionsData ?? []
  }

  const syncSession = async (nextSession: Session | null) => {
    authState.session = nextSession
    authState.user = nextSession?.user ?? null

    if (!nextSession?.user) {
      resetState()
      return
    }

    await loadAccessContext(nextSession.user.id)
  }

  const handleAuthChange = async (_event: AuthChangeEvent, nextSession: Session | null) => {
    try {
      await syncSession(nextSession)
    }
    catch (error) {
      console.error('Erro ao sincronizar sessão do usuário:', error)
      resetState()
    }
  }

  const initialize = async () => {
    if (authState.initialized) {
      return
    }

    authState.loading = true

    try {
      const currentSession = await getSession()
      await syncSession(currentSession)

      if (!authSubscriptionInitialized) {
        client.auth.onAuthStateChange((event, nextSession) => {
          void handleAuthChange(event, nextSession)
        })
        authSubscriptionInitialized = true
      }
    }
    catch (error) {
      console.error('Erro ao inicializar autenticação:', error)
      resetState()
    }
    finally {
      authState.loading = false
      authState.initialized = true
    }
  }

  const refresh = async () => {
    if (!authState.user) {
      resetState()
      return
    }

    authState.loading = true

    try {
      await loadAccessContext(authState.user.id)
    }
    finally {
      authState.loading = false
    }
  }

  const signIn = async (email: string, password: string) => {
    authState.loading = true

    try {
      const data = await supabaseSignIn(email, password)
      await syncSession(data.session)
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
      resetState()
      authState.initialized = true
      await router.push('/login')
    }
    finally {
      authState.loading = false
    }
  }

  const checkPermission = (permissionKey: string): boolean => {
    return authState.permissions.some(permission => permission.permission_key === permissionKey)
  }

  const hasRole = (roleSlug: string): boolean => {
    return authState.roles.some(role => role.slug === roleSlug)
  }

  return {
    user,
    session,
    profile,
    roles,
    permissions,
    isAuthenticated,
    isLoading,
    isInitialized,
    initialize,
    refresh,
    signIn,
    signOut,
    checkPermission,
    hasRole,
  }
}
