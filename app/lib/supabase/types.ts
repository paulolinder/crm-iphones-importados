/**
 * Supabase Database Types
 *
 * Este arquivo contém os tipos gerados do schema do Supabase.
 * Para regenerar os tipos, execute:
 * npx supabase gen types typescript --project-id migxevookiubncmcsgvy > lib/supabase/types.ts
 *
 * NOTA: Este arquivo contém tipos placeholder que devem ser substituídos
 * pelos tipos gerados automaticamente quando o schema do banco for definido.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database schema types
 * Estes tipos serão preenchidos quando o schema do banco for criado
 */
export interface Database {
  public: {
    Tables: {
      // Placeholder para tabela de usuários
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // Placeholder para tabela de clientes
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          document: string | null
          document_type: 'cpf' | 'cnpj' | null
          address: Json | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          document?: string | null
          document_type?: 'cpf' | 'cnpj' | null
          address?: Json | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          document?: string | null
          document_type?: 'cpf' | 'cnpj' | null
          address?: Json | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }

      // Placeholder para tabela de produtos
      products: {
        Row: {
          id: string
          name: string
          sku: string | null
          description: string | null
          category_id: string | null
          brand_id: string | null
          price: number
          cost: number | null
          stock_quantity: number
          min_stock: number
          active: boolean
          images: string[] | null
          specifications: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku?: string | null
          description?: string | null
          category_id?: string | null
          brand_id?: string | null
          price: number
          cost?: number | null
          stock_quantity?: number
          min_stock?: number
          active?: boolean
          images?: string[] | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string | null
          description?: string | null
          category_id?: string | null
          brand_id?: string | null
          price?: number
          cost?: number | null
          stock_quantity?: number
          min_stock?: number
          active?: boolean
          images?: string[] | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      [_ in never]: never
    }

    Enums: {
      document_type: 'cpf' | 'cnpj'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
      payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'transfer' | 'installment'
      user_role: 'admin' | 'manager' | 'seller' | 'support'
    }
  }
}

/**
 * Helper types for Supabase operations
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
