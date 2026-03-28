# Database Architecture

## Overview
The CRM uses Supabase Postgres as a single-tenant internal backoffice database for store operations, stock traceability, sales flow, finance, support, and role-based access control.

## Core Modeling Decisions
- UUID primary keys across all domain tables.
- `created_at` and `updated_at` on operational entities.
- `deleted_at` only on entities that benefit from soft delete such as `customers` and `products`.
- Product catalog is separated from physical units:
  - `products` stores the sellable catalog item.
  - `inventory_items` stores aggregate stock state.
  - `device_units` and `device_identifiers` store traceable physical devices such as iPhones by IMEI/serial.
- Auth context is normalized through `profiles`, `roles`, `permissions`, `role_permissions`, and `user_roles`.

## Enums
- `user_status`
- `customer_status`
- `product_status`
- `stock_movement_type`
- `order_status`
- `payment_status`
- `payment_method`
- `financial_transaction_type`
- `assistance_order_status`
- `warranty_status`
- `support_ticket_status`
- `device_unit_status`
- `identifier_type`
- `purchase_entry_status`
- `document_type`

## Main Tables
### Access and auth
- `profiles`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`

### CRM and catalog
- `customers`
- `customer_addresses`
- `customer_notes`
- `brands`
- `categories`
- `products`
- `product_variants`
- `product_images`

### Inventory and device traceability
- `suppliers`
- `inventory_items`
- `inventory_movements`
- `purchase_entries`
- `purchase_entry_items`
- `device_units`
- `device_identifiers`
- `imei_records`
- `serial_records`

### Sales
- `orders`
- `order_items`
- `order_payments`
- `order_status_history`

### Finance
- `cash_accounts`
- `financial_transactions`
- `accounts_payable`
- `accounts_receivable`

### Post-sales and system
- `warranties`
- `support_tickets`
- `technical_assistance_orders`
- `audit_logs`
- `app_settings`

## Key Relationships
- `customers -> orders`
- `customers -> customer_addresses`
- `customers -> customer_notes`
- `brands -> products`
- `categories -> products`
- `products -> product_images`
- `products -> product_variants`
- `products -> inventory_items`
- `products -> device_units`
- `suppliers -> purchase_entries`
- `purchase_entries -> purchase_entry_items`
- `orders -> order_items`
- `orders -> order_payments`
- `orders -> order_status_history`
- `cash_accounts -> financial_transactions`
- `device_units -> device_identifiers`
- `device_units -> imei_records`
- `device_units -> serial_records`
- `warranties -> order_items` and optionally `device_units`
- `technical_assistance_orders -> customers` and `device_units`

## Operational Notes
- First authenticated user is automatically provisioned in `profiles` and receives the `admin` role.
- Stock entries create or update `inventory_items` and can generate device-level records for trackable products.
- Order creation updates stock, payment state, customer totals, and status history.
- Finance services are prepared to relate transactions with orders, payables, and receivables.

## Source of Truth
- Schema migration: `supabase/migrations/202603290001_crm_schema.sql`
- Security and seeds: `supabase/migrations/202603290002_crm_security_and_seeds.sql`
