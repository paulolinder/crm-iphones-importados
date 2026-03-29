import { createError, getHeader, type H3Event } from 'h3'
import { getSupabaseUserClient } from '~/lib/supabase/server'

export async function requireOrderPermission(
  event: H3Event,
  permissionName: 'orders.read' | 'orders.update',
) {
  const accessToken = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ?? ''

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  const userClient = getSupabaseUserClient(event, accessToken)
  const { data: allowed, error } = await userClient.rpc('current_user_has_permission', {
    permission_name: permissionName,
  })

  if (error || !allowed) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão para esta operação' })
  }

  return { userClient, accessToken }
}
