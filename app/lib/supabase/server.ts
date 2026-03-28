/**
 * Supabase Server Client Configuration
 *
 * Este arquivo configura o cliente Supabase para uso no lado do servidor.
 * Usa a service key para operações que requerem privilégios de admin.
 *
 * IMPORTANTE: Nunca exponha a service key no lado do cliente.
 */

import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { Database } from './types'

/**
 * Cria um cliente Supabase para uso em API routes do servidor
 * Usa a service key para acesso total ao banco de dados
 */
export function getSupabaseServerClient(event?: H3Event) {
  const config = useRuntimeConfig(event)

  if (!config.public.supabaseUrl) {
    throw new Error('SUPABASE_URL não está configurada')
  }

  if (!config.supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_KEY não está configurada')
  }

  return createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'x-application-name': 'eleve-imports-crm-server',
        },
      },
    }
  )
}

/**
 * Cria um cliente Supabase autenticado com o token do usuário atual
 * Útil para operações que devem respeitar as RLS policies
 */
export function getSupabaseUserClient(event: H3Event, accessToken: string) {
  const config = useRuntimeConfig(event)

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    throw new Error('Supabase URL e Key são obrigatórios')
  }

  return createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-application-name': 'eleve-imports-crm-user',
        },
      },
    }
  )
}
