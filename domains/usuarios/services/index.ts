import type { Tables } from '~/lib/supabase/types'
import { assertSupabaseResult } from '../../shared/service-utils'

export type AdminUserStatus = Tables<'profiles'>['status']

export interface AdminUserRow {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  job_title: string | null
  status: AdminUserStatus
  last_login_at: string | null
  created_at: string
  roles: { id: string; slug: string; name: string }[]
}

function mapProfile(
  row: Tables<'profiles'>,
  roles: { id: string; slug: string; name: string }[],
): AdminUserRow {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    phone: row.phone,
    job_title: row.job_title,
    status: row.status,
    last_login_at: row.last_login_at,
    created_at: row.created_at,
    roles,
  }
}

export function useUsersAdminService() {
  const { client } = useSupabase()

  const list = async (): Promise<AdminUserRow[]> => {
    const { data: profiles, error } = await client
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })

    assertSupabaseResult(error, 'Não foi possível carregar os usuários')

    const ids = (profiles ?? []).map(p => p.id)
    if (!ids.length) {
      return []
    }

    const { data: links, error: urError } = await client
      .from('user_roles')
      .select('user_id, role_id, roles ( id, slug, name )')
      .in('user_id', ids)

    assertSupabaseResult(urError, 'Não foi possível carregar os papéis')

    const roleByUser = new Map<string, { id: string; slug: string; name: string }[]>()

    for (const link of links ?? []) {
      const r = link.roles as { id: string; slug: string; name: string } | null
      if (!r) {
        continue
      }
      const list = roleByUser.get(link.user_id) ?? []
      list.push({ id: r.id, slug: r.slug, name: r.name })
      roleByUser.set(link.user_id, list)
    }

    return (profiles ?? []).map(p =>
      mapProfile(p, roleByUser.get(p.id) ?? []),
    )
  }

  const getById = async (id: string): Promise<AdminUserRow | null> => {
    const { data: profile, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível carregar o usuário')
    if (!profile) {
      return null
    }

    const { data: links, error: urError } = await client
      .from('user_roles')
      .select('role_id, roles ( id, slug, name )')
      .eq('user_id', id)

    assertSupabaseResult(urError, 'Não foi possível carregar os papéis do usuário')

    const roles = (links ?? [])
      .map(l => l.roles as { id: string; slug: string; name: string } | null)
      .filter((r): r is { id: string; slug: string; name: string } => r !== null)

    return mapProfile(profile, roles)
  }

  const listRoles = async () => {
    const { data, error } = await client
      .from('roles')
      .select('id, slug, name, description')
      .order('name')

    assertSupabaseResult(error, 'Não foi possível carregar os papéis')
    return data ?? []
  }

  const updateProfile = async (
    id: string,
    payload: {
      full_name?: string | null
      phone?: string | null
      job_title?: string | null
      status?: AdminUserStatus
    },
  ) => {
    const { error } = await client
      .from('profiles')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    assertSupabaseResult(error, 'Não foi possível atualizar o perfil')
    return getById(id)
  }

  /** Substitui todos os papéis do usuário */
  const setUserRoles = async (userId: string, roleIds: string[]) => {
    const { error: delError } = await client
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    assertSupabaseResult(delError, 'Não foi possível limpar papéis anteriores')

    if (!roleIds.length) {
      return []
    }

    const { error: insError } = await client
      .from('user_roles')
      .insert(roleIds.map(role_id => ({ user_id: userId, role_id })))

    assertSupabaseResult(insError, 'Não foi possível atribuir papéis')
    return getById(userId)
  }

  return {
    list,
    getById,
    listRoles,
    updateProfile,
    setUserRoles,
  }
}
