/**
 * Supabase Client Configuration
 *
 * Este arquivo configura o cliente Supabase para uso no lado do cliente (browser).
 * Use este cliente para operações que não requerem privilégios de admin.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

/**
 * Retorna uma instância singleton do cliente Supabase
 * Usa as credenciais públicas (anon key) para acesso do lado do cliente
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseKey) {
    throw new Error('Supabase URL e Key são obrigatórios. Configure as variáveis de ambiente.')
  }

  supabaseClient = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'x-application-name': 'eleve-imports-crm',
        },
      },
    }
  )

  return supabaseClient
}

/**
 * Alias para compatibilidade
 */
export const supabase = () => getSupabaseClient()
