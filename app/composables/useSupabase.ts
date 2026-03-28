/**
 * Composable para acesso ao Supabase
 *
 * Fornece acesso fácil ao cliente Supabase com tipagem completa
 */

import { getSupabaseClient } from '~/lib/supabase'
import type { Database } from '~/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useSupabase() {
  const client = getSupabaseClient()
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  /**
   * Inicializa o listener de autenticação
   */
  const initAuth = async () => {
    loading.value = true

    try {
      const { data: { session: currentSession } } = await client.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null

      client.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    }
    catch (error) {
      console.error('Erro ao inicializar autenticação:', error)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Login com email e senha
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  /**
   * Logout
   */
  const signOut = async () => {
    const { error } = await client.auth.signOut()
    if (error) throw error
  }

  /**
   * Registro de novo usuário
   */
  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) throw error
    return data
  }

  /**
   * Recuperação de senha
   */
  const resetPassword = async (email: string) => {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  }

  /**
   * Atualização de senha
   */
  const updatePassword = async (newPassword: string) => {
    const { error } = await client.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }

  return {
    client,
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    initAuth,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
  }
}

/**
 * Composable para operações de banco de dados
 */
export function useSupabaseDB<T extends keyof Database['public']['Tables']>(table: T) {
  const client = getSupabaseClient()

  type Row = Database['public']['Tables'][T]['Row']
  type Insert = Database['public']['Tables'][T]['Insert']
  type Update = Database['public']['Tables'][T]['Update']

  const data = ref<Row[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Busca todos os registros
   */
  const fetchAll = async (options?: {
    columns?: string
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      let query = client.from(table).select(options?.columns ?? '*')

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1)
      }

      const { data: result, error: err } = await query

      if (err) throw err
      data.value = result as Row[]
      return result as Row[]
    }
    catch (e) {
      error.value = e as Error
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Busca um registro por ID
   */
  const fetchById = async (id: string, columns?: string) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: err } = await client
        .from(table)
        .select(columns ?? '*')
        .eq('id', id)
        .single()

      if (err) throw err
      return result as Row
    }
    catch (e) {
      error.value = e as Error
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Cria um novo registro
   */
  const create = async (record: Insert) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: err } = await client
        .from(table)
        .insert(record as any)
        .select()
        .single()

      if (err) throw err
      return result as Row
    }
    catch (e) {
      error.value = e as Error
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Atualiza um registro
   */
  const update = async (id: string, record: Update) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: err } = await client
        .from(table)
        .update(record as any)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return result as Row
    }
    catch (e) {
      error.value = e as Error
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Remove um registro
   */
  const remove = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await client
        .from(table)
        .delete()
        .eq('id', id)

      if (err) throw err
    }
    catch (e) {
      error.value = e as Error
      throw e
    }
    finally {
      loading.value = false
    }
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  }
}
