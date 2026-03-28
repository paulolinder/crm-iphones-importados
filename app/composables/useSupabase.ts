import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '~/lib/supabase'
import type { Database, Tables, TablesInsert, TablesUpdate } from '~/lib/supabase/types'

export function useSupabase() {
  const client = getSupabaseClient()

  const getSession = async (): Promise<Session | null> => {
    const { data, error } = await client.auth.getSession()

    if (error) {
      throw error
    }

    return data.session
  }

  const getUser = async (): Promise<User | null> => {
    const { data, error } = await client.auth.getUser()

    if (error) {
      throw error
    }

    return data.user
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data
  }

  const signOut = async () => {
    const { error } = await client.auth.signOut()

    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) {
      throw error
    }

    return data
  }

  const resetPassword = async (email: string) => {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await client.auth.updateUser({ password: newPassword })

    if (error) {
      throw error
    }
  }

  return {
    client,
    getSession,
    getUser,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
  }
}

export function useSupabaseDB<T extends keyof Database['public']['Tables'] & string>(table: T) {
  const client = getSupabaseClient()
  const data = ref<Tables<T>[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const relation = () => client.from(table as never)

  const fetchAll = async (options?: {
    columns?: string
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      let query = relation().select(options?.columns ?? '*')

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        })
      }

      if (typeof options?.offset === 'number') {
        const limit = options.limit ?? 10
        query = query.range(options.offset, options.offset + limit - 1)
      }
      else if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data: result, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      data.value = (result ?? []) as Tables<T>[]
      return data.value
    }
    catch (caughtError) {
      error.value = caughtError as Error
      throw caughtError
    }
    finally {
      loading.value = false
    }
  }

  const fetchById = async (id: string, columns?: string) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: queryError } = await client
        .from(table as never)
        .select(columns ?? '*')
        .eq('id' as never, id)
        .maybeSingle()

      if (queryError) {
        throw queryError
      }

      return result as Tables<T> | null
    }
    catch (caughtError) {
      error.value = caughtError as Error
      throw caughtError
    }
    finally {
      loading.value = false
    }
  }

  const create = async (record: TablesInsert<T>) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: queryError } = await client
        .from(table as never)
        .insert(record as never)
        .select()
        .single()

      if (queryError) {
        throw queryError
      }

      return result as Tables<T>
    }
    catch (caughtError) {
      error.value = caughtError as Error
      throw caughtError
    }
    finally {
      loading.value = false
    }
  }

  const update = async (id: string, record: TablesUpdate<T>) => {
    loading.value = true
    error.value = null

    try {
      const { data: result, error: queryError } = await client
        .from(table as never)
        .update(record as never)
        .eq('id' as never, id)
        .select()
        .single()

      if (queryError) {
        throw queryError
      }

      return result as Tables<T>
    }
    catch (caughtError) {
      error.value = caughtError as Error
      throw caughtError
    }
    finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: queryError } = await client
        .from(table as never)
        .delete()
        .eq('id' as never, id)

      if (queryError) {
        throw queryError
      }
    }
    catch (caughtError) {
      error.value = caughtError as Error
      throw caughtError
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
