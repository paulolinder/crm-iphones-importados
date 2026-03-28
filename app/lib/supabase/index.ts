/**
 * Supabase Module Index
 *
 * Exporta todos os utilitários relacionados ao Supabase
 */

export { getSupabaseClient, supabase } from './client'
export { getSupabaseServerClient, getSupabaseUserClient } from './server'
export type { Database, Tables, InsertTables, UpdateTables, Enums, Json } from './types'
