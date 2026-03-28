/**
 * Supabase Database Types
 *
 * Gerado a partir do schema real do projeto Supabase `migxevookiubncmcsgvy`.
 * Sempre que o schema mudar, gere novamente via MCP/CLI e atualize este arquivo.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      accounts_payable: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          paid_at: string | null
          status: Database['public']['Enums']['payment_status']
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_payable_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          description: string
          due_date: string
          id: string
          notes: string | null
          order_id: string | null
          received_at: string | null
          status: Database['public']['Enums']['payment_status']
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          description: string
          due_date: string
          id?: string
          notes?: string | null
          order_id?: string | null
          received_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          received_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_receivable_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_receivable_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'app_settings_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
          new_values: Json | null
          old_values: Json | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          new_values?: Json | null
          old_values?: Json | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          new_values?: Json | null
          old_values?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_actor_user_id_fkey'
            columns: ['actor_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      brands: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cash_accounts: {
        Row: {
          account_type: string
          active: boolean
          created_at: string
          current_balance: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          account_type?: string
          active?: boolean
          created_at?: string
          current_balance?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          account_type?: string
          active?: boolean
          created_at?: string
          current_balance?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      customer_addresses: {
        Row: {
          city: string
          complement: string | null
          country: string
          created_at: string
          customer_id: string
          id: string
          is_primary: boolean
          label: string | null
          neighborhood: string | null
          number: string | null
          postal_code: string | null
          state: string
          street: string
          updated_at: string
        }
        Insert: {
          city: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id: string
          id?: string
          is_primary?: boolean
          label?: string | null
          neighborhood?: string | null
          number?: string | null
          postal_code?: string | null
          state: string
          street: string
          updated_at?: string
        }
        Update: {
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_primary?: boolean
          label?: string | null
          neighborhood?: string | null
          number?: string | null
          postal_code?: string | null
          state?: string
          street?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_addresses_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
        ]
      }
      customer_notes: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          note: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          note: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          note?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_notes_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_notes_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          birth_date: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          document: string | null
          document_type: Database['public']['Enums']['document_type'] | null
          email: string | null
          gender: string | null
          id: string
          last_purchase_at: string | null
          mobile: string | null
          name: string
          notes: string | null
          phone: string | null
          status: Database['public']['Enums']['customer_status']
          tags: string[]
          total_orders: number
          total_spent: number
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          document?: string | null
          document_type?: Database['public']['Enums']['document_type'] | null
          email?: string | null
          gender?: string | null
          id?: string
          last_purchase_at?: string | null
          mobile?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database['public']['Enums']['customer_status']
          tags?: string[]
          total_orders?: number
          total_spent?: number
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          document?: string | null
          document_type?: Database['public']['Enums']['document_type'] | null
          email?: string | null
          gender?: string | null
          id?: string
          last_purchase_at?: string | null
          mobile?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database['public']['Enums']['customer_status']
          tags?: string[]
          total_orders?: number
          total_spent?: number
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'customers_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      device_identifiers: {
        Row: {
          created_at: string
          device_unit_id: string
          id: string
          identifier_type: Database['public']['Enums']['identifier_type']
          identifier_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_unit_id: string
          id?: string
          identifier_type: Database['public']['Enums']['identifier_type']
          identifier_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_unit_id?: string
          id?: string
          identifier_type?: Database['public']['Enums']['identifier_type']
          identifier_value?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'device_identifiers_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: false
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
        ]
      }
      device_units: {
        Row: {
          cost_price: number | null
          created_at: string
          id: string
          inventory_item_id: string | null
          metadata: Json
          product_id: string
          product_variant_id: string | null
          purchase_entry_item_id: string | null
          purchased_at: string | null
          sale_price: number | null
          sold_at: string | null
          status: Database['public']['Enums']['device_unit_status']
          supplier_id: string | null
          updated_at: string
          warranty_until: string | null
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          metadata?: Json
          product_id: string
          product_variant_id?: string | null
          purchase_entry_item_id?: string | null
          purchased_at?: string | null
          sale_price?: number | null
          sold_at?: string | null
          status?: Database['public']['Enums']['device_unit_status']
          supplier_id?: string | null
          updated_at?: string
          warranty_until?: string | null
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          metadata?: Json
          product_id?: string
          product_variant_id?: string | null
          purchase_entry_item_id?: string | null
          purchased_at?: string | null
          sale_price?: number | null
          sold_at?: string | null
          status?: Database['public']['Enums']['device_unit_status']
          supplier_id?: string | null
          updated_at?: string
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'device_units_inventory_item_id_fkey'
            columns: ['inventory_item_id']
            isOneToOne: false
            referencedRelation: 'inventory_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'device_units_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'device_units_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'device_units_purchase_entry_item_id_fkey'
            columns: ['purchase_entry_item_id']
            isOneToOne: false
            referencedRelation: 'purchase_entry_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'device_units_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
        ]
      }
      financial_transactions: {
        Row: {
          accounts_payable_id: string | null
          accounts_receivable_id: string | null
          amount: number
          cash_account_id: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          metadata: Json
          occurred_at: string
          order_id: string | null
          transaction_type: Database['public']['Enums']['financial_transaction_type']
          updated_at: string
        }
        Insert: {
          accounts_payable_id?: string | null
          accounts_receivable_id?: string | null
          amount: number
          cash_account_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          metadata?: Json
          occurred_at?: string
          order_id?: string | null
          transaction_type: Database['public']['Enums']['financial_transaction_type']
          updated_at?: string
        }
        Update: {
          accounts_payable_id?: string | null
          accounts_receivable_id?: string | null
          amount?: number
          cash_account_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          order_id?: string | null
          transaction_type?: Database['public']['Enums']['financial_transaction_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'financial_transactions_accounts_payable_id_fkey'
            columns: ['accounts_payable_id']
            isOneToOne: false
            referencedRelation: 'accounts_payable'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_accounts_receivable_id_fkey'
            columns: ['accounts_receivable_id']
            isOneToOne: false
            referencedRelation: 'accounts_receivable'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_cash_account_id_fkey'
            columns: ['cash_account_id']
            isOneToOne: false
            referencedRelation: 'cash_accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      imei_records: {
        Row: {
          created_at: string
          device_unit_id: string
          id: string
          imei: string
          status: Database['public']['Enums']['device_unit_status']
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_unit_id: string
          id?: string
          imei: string
          status?: Database['public']['Enums']['device_unit_status']
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_unit_id?: string
          id?: string
          imei?: string
          status?: Database['public']['Enums']['device_unit_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'imei_records_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: true
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
        ]
      }
      inventory_items: {
        Row: {
          average_cost: number | null
          created_at: string
          id: string
          last_movement_at: string | null
          max_stock: number | null
          min_stock: number
          product_id: string
          product_variant_id: string | null
          quantity: number
          reserved_quantity: number
          updated_at: string
        }
        Insert: {
          average_cost?: number | null
          created_at?: string
          id?: string
          last_movement_at?: string | null
          max_stock?: number | null
          min_stock?: number
          product_id: string
          product_variant_id?: string | null
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Update: {
          average_cost?: number | null
          created_at?: string
          id?: string
          last_movement_at?: string | null
          max_stock?: number | null
          min_stock?: number
          product_id?: string
          product_variant_id?: string | null
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_items_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string | null
          movement_type: Database['public']['Enums']['stock_movement_type']
          new_quantity: number
          notes: string | null
          performed_by: string | null
          previous_quantity: number
          product_id: string
          product_variant_id: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          total_cost: number | null
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          movement_type: Database['public']['Enums']['stock_movement_type']
          new_quantity?: number
          notes?: string | null
          performed_by?: string | null
          previous_quantity?: number
          product_id: string
          product_variant_id?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          movement_type?: Database['public']['Enums']['stock_movement_type']
          new_quantity?: number
          notes?: string | null
          performed_by?: string | null
          previous_quantity?: number
          product_id?: string
          product_variant_id?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_movements_inventory_item_id_fkey'
            columns: ['inventory_item_id']
            isOneToOne: false
            referencedRelation: 'inventory_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_movements_performed_by_fkey'
            columns: ['performed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_movements_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_movements_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          cost_amount: number | null
          created_at: string
          device_unit_id: string | null
          discount_amount: number
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_variant_id: string | null
          quantity: number
          sku: string | null
          total_amount: number
          unit_price: number
          updated_at: string
          warranty_until: string | null
        }
        Insert: {
          cost_amount?: number | null
          created_at?: string
          device_unit_id?: string | null
          discount_amount?: number
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_variant_id?: string | null
          quantity?: number
          sku?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string
          warranty_until?: string | null
        }
        Update: {
          cost_amount?: number | null
          created_at?: string
          device_unit_id?: string | null
          discount_amount?: number
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_variant_id?: string | null
          quantity?: number
          sku?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: false
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
        ]
      }
      order_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          installment_count: number
          method: Database['public']['Enums']['payment_method']
          notes: string | null
          order_id: string
          paid_at: string | null
          status: Database['public']['Enums']['payment_status']
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          installment_count?: number
          method: Database['public']['Enums']['payment_method']
          notes?: string | null
          order_id: string
          paid_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          installment_count?: number
          method?: Database['public']['Enums']['payment_method']
          notes?: string | null
          order_id?: string
          paid_at?: string | null
          status?: Database['public']['Enums']['payment_status']
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_payments_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string
          status: Database['public']['Enums']['order_status']
          updated_at: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          status: Database['public']['Enums']['order_status']
          updated_at?: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database['public']['Enums']['order_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_status_history_changed_by_fkey'
            columns: ['changed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_status_history_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          customer_id: string
          delivered_at: string | null
          discount_amount: number
          discount_type: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          payment_method: Database['public']['Enums']['payment_method'] | null
          payment_status: Database['public']['Enums']['payment_status']
          seller_id: string | null
          shipped_at: string | null
          shipping_amount: number
          status: Database['public']['Enums']['order_status']
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_id: string
          delivered_at?: string | null
          discount_amount?: number
          discount_type?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          payment_method?: Database['public']['Enums']['payment_method'] | null
          payment_status?: Database['public']['Enums']['payment_status']
          seller_id?: string | null
          shipped_at?: string | null
          shipping_amount?: number
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_id?: string
          delivered_at?: string | null
          discount_amount?: number
          discount_type?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          payment_method?: Database['public']['Enums']['payment_method'] | null
          payment_status?: Database['public']['Enums']['payment_status']
          seller_id?: string | null
          shipped_at?: string | null
          shipping_amount?: number
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_seller_id_fkey'
            columns: ['seller_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module: string
          permission_key: string
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
          permission_key: string
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          permission_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          attributes: Json
          barcode: string | null
          cost_price: number | null
          created_at: string
          id: string
          name: string
          product_id: string
          sale_price: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          attributes?: Json
          barcode?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          name: string
          product_id: string
          sale_price?: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          attributes?: Json
          barcode?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          sale_price?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          barcode: string | null
          brand_id: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string
          deleted_at: string | null
          description: string | null
          dimensions: Json
          featured: boolean
          id: string
          is_trackable: boolean
          max_stock: number | null
          min_stock: number
          name: string
          promotional_price: number | null
          sale_price: number
          sku: string | null
          slug: string
          specifications: Json
          status: Database['public']['Enums']['product_status']
          updated_at: string
          warranty_months: number | null
          weight: number | null
        }
        Insert: {
          active?: boolean
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json
          featured?: boolean
          id?: string
          is_trackable?: boolean
          max_stock?: number | null
          min_stock?: number
          name: string
          promotional_price?: number | null
          sale_price?: number
          sku?: string | null
          slug: string
          specifications?: Json
          status?: Database['public']['Enums']['product_status']
          updated_at?: string
          warranty_months?: number | null
          weight?: number | null
        }
        Update: {
          active?: boolean
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json
          featured?: boolean
          id?: string
          is_trackable?: boolean
          max_stock?: number | null
          min_stock?: number
          name?: string
          promotional_price?: number | null
          sale_price?: number
          sku?: string | null
          slug?: string
          specifications?: Json
          status?: Database['public']['Enums']['product_status']
          updated_at?: string
          warranty_months?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          job_title: string | null
          last_login_at: string | null
          last_name: string | null
          metadata: Json
          phone: string | null
          status: Database['public']['Enums']['user_status']
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json
          phone?: string | null
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json
          phone?: string | null
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
        }
        Relationships: []
      }
      purchase_entries: {
        Row: {
          created_at: string
          created_by: string | null
          entry_date: string
          entry_number: string
          id: string
          invoice_number: string | null
          notes: string | null
          status: Database['public']['Enums']['purchase_entry_status']
          supplier_id: string | null
          total_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_number: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['purchase_entry_status']
          supplier_id?: string | null
          total_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          entry_number?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['purchase_entry_status']
          supplier_id?: string | null
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'purchase_entries_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchase_entries_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
        ]
      }
      purchase_entry_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_variant_id: string | null
          purchase_entry_id: string
          quantity: number
          total_cost: number
          unit_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_variant_id?: string | null
          purchase_entry_id: string
          quantity: number
          total_cost?: number
          unit_cost?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_variant_id?: string | null
          purchase_entry_id?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'purchase_entry_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchase_entry_items_product_variant_id_fkey'
            columns: ['product_variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'purchase_entry_items_purchase_entry_id_fkey'
            columns: ['purchase_entry_id']
            isOneToOne: false
            referencedRelation: 'purchase_entries'
            referencedColumns: ['id']
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_id_fkey'
            columns: ['permission_id']
            isOneToOne: false
            referencedRelation: 'permissions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'role_permissions_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      serial_records: {
        Row: {
          created_at: string
          device_unit_id: string
          id: string
          serial_number: string
          status: Database['public']['Enums']['device_unit_status']
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_unit_id: string
          id?: string
          serial_number: string
          status?: Database['public']['Enums']['device_unit_status']
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_unit_id?: string
          id?: string
          serial_number?: string
          status?: Database['public']['Enums']['device_unit_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'serial_records_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: true
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean
          contact_name: string | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          description: string
          device_unit_id: string | null
          id: string
          opened_by: string | null
          order_id: string | null
          priority: string
          resolved_at: string | null
          status: Database['public']['Enums']['support_ticket_status']
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          description: string
          device_unit_id?: string | null
          id?: string
          opened_by?: string | null
          order_id?: string | null
          priority?: string
          resolved_at?: string | null
          status?: Database['public']['Enums']['support_ticket_status']
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          device_unit_id?: string | null
          id?: string
          opened_by?: string | null
          order_id?: string | null
          priority?: string
          resolved_at?: string | null
          status?: Database['public']['Enums']['support_ticket_status']
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'support_tickets_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: false
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_opened_by_fkey'
            columns: ['opened_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      technical_assistance_orders: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          delivered_at: string | null
          device_unit_id: string | null
          diagnosis: string | null
          estimated_cost: number | null
          final_cost: number | null
          finished_at: string | null
          id: string
          issue_description: string
          order_number: string
          solution: string | null
          started_at: string | null
          status: Database['public']['Enums']['assistance_order_status']
          support_ticket_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          delivered_at?: string | null
          device_unit_id?: string | null
          diagnosis?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          finished_at?: string | null
          id?: string
          issue_description: string
          order_number: string
          solution?: string | null
          started_at?: string | null
          status?: Database['public']['Enums']['assistance_order_status']
          support_ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          delivered_at?: string | null
          device_unit_id?: string | null
          diagnosis?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          finished_at?: string | null
          id?: string
          issue_description?: string
          order_number?: string
          solution?: string | null
          started_at?: string | null
          status?: Database['public']['Enums']['assistance_order_status']
          support_ticket_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'technical_assistance_orders_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'technical_assistance_orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'technical_assistance_orders_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: false
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'technical_assistance_orders_support_ticket_id_fkey'
            columns: ['support_ticket_id']
            isOneToOne: false
            referencedRelation: 'support_tickets'
            referencedColumns: ['id']
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      warranties: {
        Row: {
          claim_reason: string | null
          claimed_at: string | null
          created_at: string
          customer_id: string | null
          device_unit_id: string | null
          id: string
          notes: string | null
          order_item_id: string | null
          status: Database['public']['Enums']['warranty_status']
          terms: string | null
          updated_at: string
          warranty_end: string | null
          warranty_start: string | null
        }
        Insert: {
          claim_reason?: string | null
          claimed_at?: string | null
          created_at?: string
          customer_id?: string | null
          device_unit_id?: string | null
          id?: string
          notes?: string | null
          order_item_id?: string | null
          status?: Database['public']['Enums']['warranty_status']
          terms?: string | null
          updated_at?: string
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Update: {
          claim_reason?: string | null
          claimed_at?: string | null
          created_at?: string
          customer_id?: string | null
          device_unit_id?: string | null
          id?: string
          notes?: string | null
          order_item_id?: string | null
          status?: Database['public']['Enums']['warranty_status']
          terms?: string | null
          updated_at?: string
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'warranties_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'warranties_device_unit_id_fkey'
            columns: ['device_unit_id']
            isOneToOne: false
            referencedRelation: 'device_units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'warranties_order_item_id_fkey'
            columns: ['order_item_id']
            isOneToOne: false
            referencedRelation: 'order_items'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      current_user_has_role: {
        Args: { role_slug: string }
        Returns: boolean
      }
      current_user_is_admin: {
        Args: never
        Returns: boolean
      }
    }
    Enums: {
      assistance_order_status:
        | 'pending'
        | 'diagnosing'
        | 'waiting_parts'
        | 'in_repair'
        | 'ready'
        | 'delivered'
        | 'cancelled'
      customer_status: 'lead' | 'active' | 'inactive' | 'vip' | 'blocked'
      device_unit_status:
        | 'available'
        | 'reserved'
        | 'sold'
        | 'returned'
        | 'defective'
        | 'in_assistance'
      document_type: 'cpf' | 'cnpj' | 'rg' | 'passport' | 'other'
      financial_transaction_type:
        | 'income'
        | 'expense'
        | 'transfer'
        | 'adjustment'
      identifier_type: 'imei' | 'serial' | 'meid' | 'other'
      order_status:
        | 'draft'
        | 'pending'
        | 'confirmed'
        | 'processing'
        | 'shipped'
        | 'delivered'
        | 'cancelled'
        | 'returned'
      payment_method:
        | 'cash'
        | 'credit_card'
        | 'debit_card'
        | 'pix'
        | 'transfer'
        | 'installment'
        | 'check'
        | 'other'
      payment_status:
        | 'pending'
        | 'paid'
        | 'partial'
        | 'refunded'
        | 'failed'
        | 'cancelled'
      product_status: 'draft' | 'active' | 'inactive' | 'archived'
      purchase_entry_status: 'draft' | 'received' | 'cancelled'
      stock_movement_type:
        | 'entry'
        | 'exit'
        | 'adjustment'
        | 'transfer'
        | 'reservation'
        | 'release'
      support_ticket_status:
        | 'open'
        | 'in_progress'
        | 'waiting_customer'
        | 'resolved'
        | 'cancelled'
      user_status: 'active' | 'inactive' | 'blocked'
      warranty_status: 'valid' | 'expiring' | 'expired' | 'claimed' | 'void'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export type InsertTables<T extends keyof Database['public']['Tables']> = TablesInsert<T>
export type UpdateTables<T extends keyof Database['public']['Tables']> = TablesUpdate<T>
