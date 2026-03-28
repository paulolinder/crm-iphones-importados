import type { AuthUserProfile } from '../types'
import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult } from '../../shared/service-utils'

type ProfileRow = Tables<'profiles'>
type RoleRow = Tables<'roles'>
type PermissionRow = Tables<'permissions'>

interface RoleWithRelation {
  role_id: string
  role: RoleRow | null
}

export function useAuthUsersService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const getCurrentProfile = async (): Promise<AuthUserProfile | null> => {
    if (!user.value?.id) {
      return null
    }

    const { data: profile, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível carregar o perfil autenticado')

    if (!profile) {
      return null
    }

    const { data: rolesData, error: rolesError } = await client
      .from('user_roles')
      .select('role_id, role:roles(*)')
      .eq('user_id', profile.id)

    assertSupabaseResult(rolesError, 'Não foi possível carregar os papéis do usuário')

    const roles = (rolesData ?? []) as unknown as RoleWithRelation[]
    const roleIds = roles.map(item => item.role_id)

    let permissions: PermissionRow[] = []

    if (roleIds.length) {
      const { data: rolePermissions, error: permissionsError } = await client
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds)

      assertSupabaseResult(permissionsError, 'Não foi possível carregar as permissões do usuário')

      const permissionIds = Array.from(new Set((rolePermissions ?? []).map(item => item.permission_id)))

      if (permissionIds.length) {
        const { data: permissionRows, error: permissionRowsError } = await client
          .from('permissions')
          .select('*')
          .in('id', permissionIds)

        assertSupabaseResult(permissionRowsError, 'Não foi possível carregar os detalhes das permissões do usuário')
        permissions = permissionRows ?? []
      }
    }

    return {
      id: profile.id,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: profile.full_name,
      phone: profile.phone,
      status: profile.status,
      roles: roles.map(item => item.role?.slug).filter((value): value is string => Boolean(value)),
      permissions: permissions.map(permission => permission.permission_key),
    }
  }

  return {
    getCurrentProfile,
  }
}
