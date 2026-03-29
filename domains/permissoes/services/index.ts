import { assertSupabaseResult } from '../../shared/service-utils'

export function usePermissionsMatrixService() {
  const { client } = useSupabase()

  const loadMatrix = async () => {
    const [{ data: roles, error: rErr }, { data: permissions, error: pErr }, { data: links, error: lErr }] = await Promise.all([
      client.from('roles').select('id, name, slug').order('name'),
      client.from('permissions').select('id, permission_key, description').order('permission_key'),
      client.from('role_permissions').select('role_id, permission_id'),
    ])

    assertSupabaseResult(rErr, 'Não foi possível carregar papéis')
    assertSupabaseResult(pErr, 'Não foi possível carregar permissões')
    assertSupabaseResult(lErr, 'Não foi possível carregar vínculos')

    return {
      roles: roles ?? [],
      permissions: permissions ?? [],
      links: links ?? [],
    }
  }

  const setPermission = async (roleId: string, permissionId: string, enabled: boolean) => {
    if (enabled) {
      const { error } = await client
        .from('role_permissions')
        .insert({ role_id: roleId, permission_id: permissionId })

      if (error?.code === '23505') {
        return
      }
      assertSupabaseResult(error, 'Não foi possível atribuir a permissão')
    }
    else {
      const { error } = await client
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId)
        .eq('permission_id', permissionId)

      assertSupabaseResult(error, 'Não foi possível remover a permissão')
    }
  }

  return { loadMatrix, setPermission }
}
