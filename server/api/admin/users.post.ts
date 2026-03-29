/**
 * Cria usuário no Auth + perfil (trigger) + papéis.
 * Requer header Authorization: Bearer <access_token> com permissão users.manage.
 */
import { getSupabaseServerClient, getSupabaseUserClient } from '~/lib/supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string
    password: string
    full_name?: string
    phone?: string | null
    role_ids?: string[]
  }>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail e senha são obrigatórios' })
  }

  const accessToken = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ?? ''

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  const userClient = getSupabaseUserClient(event, accessToken)
  const { data: can, error: rpcErr } = await userClient.rpc('current_user_has_permission', {
    permission_name: 'users.manage',
  })

  if (rpcErr || !can) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão para criar usuários' })
  }

  const server = getSupabaseServerClient(event)
  const { data: created, error: createErr } = await server.auth.admin.createUser({
    email: body.email.trim().toLowerCase(),
    password: body.password,
    email_confirm: true,
    user_metadata: {
      full_name: body.full_name?.trim() || body.email.split('@')[0],
    },
  })

  if (createErr || !created.user) {
    throw createError({
      statusCode: 400,
      statusMessage: createErr?.message ?? 'Não foi possível criar o usuário',
    })
  }

  const userId = created.user.id

  if (body.phone || body.full_name) {
    const { error: upErr } = await server
      .from('profiles')
      .update({
        full_name: body.full_name?.trim() ?? null,
        phone: body.phone?.trim() ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (upErr) {
      console.warn('[admin/users.post] profile update', upErr.message)
    }
  }

  if (body.role_ids?.length) {
    await server.from('user_roles').delete().eq('user_id', userId)

    const { error: roleErr } = await server.from('user_roles').insert(
      body.role_ids.map(role_id => ({ user_id: userId, role_id })),
    )

    if (roleErr) {
      console.warn('[admin/users.post] roles', roleErr.message)
    }
  }

  return { id: userId, email: created.user.email }
})
