import type { Json } from '~/lib/supabase/types'
import { assertSupabaseResult } from '../../shared/service-utils'

export function useAppSettingsService() {
  const { client } = useSupabase()
  const { user } = useAuth()

  const getByKey = async (key: string): Promise<Json | null> => {
    const { data, error } = await client
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .maybeSingle()

    assertSupabaseResult(error, 'Não foi possível carregar a configuração')
    return data?.setting_value ?? null
  }

  const saveByKey = async (key: string, value: Json, description?: string | null) => {
    const { data: existing, error: fetchError } = await client
      .from('app_settings')
      .select('id')
      .eq('setting_key', key)
      .maybeSingle()

    assertSupabaseResult(fetchError, 'Não foi possível verificar a configuração')

    const now = new Date().toISOString()

    if (existing?.id) {
      const { error } = await client
        .from('app_settings')
        .update({
          setting_value: value,
          description: description ?? undefined,
          updated_at: now,
          updated_by: user.value?.id ?? null,
        })
        .eq('id', existing.id)

      assertSupabaseResult(error, 'Não foi possível salvar a configuração')
      return
    }

    const { error } = await client
      .from('app_settings')
      .insert({
        setting_key: key,
        setting_value: value,
        description: description ?? null,
        is_public: false,
        updated_at: now,
        updated_by: user.value?.id ?? null,
      })

    assertSupabaseResult(error, 'Não foi possível criar a configuração')
  }

  return { getByKey, saveByKey }
}
