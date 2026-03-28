begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type public.user_status as enum ('active', 'inactive', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'customer_status') then
    create type public.customer_status as enum ('lead', 'active', 'inactive', 'vip', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft', 'active', 'inactive', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'stock_movement_type') then
    create type public.stock_movement_type as enum ('entry', 'exit', 'adjustment', 'transfer', 'reservation', 'release');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('draft', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'paid', 'partial', 'refunded', 'failed', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('cash', 'credit_card', 'debit_card', 'pix', 'transfer', 'installment', 'check', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'financial_transaction_type') then
    create type public.financial_transaction_type as enum ('income', 'expense', 'transfer', 'adjustment');
  end if;

  if not exists (select 1 from pg_type where typname = 'assistance_order_status') then
    create type public.assistance_order_status as enum ('pending', 'diagnosing', 'waiting_parts', 'in_repair', 'ready', 'delivered', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'warranty_status') then
    create type public.warranty_status as enum ('valid', 'expiring', 'expired', 'claimed', 'void');
  end if;

  if not exists (select 1 from pg_type where typname = 'support_ticket_status') then
    create type public.support_ticket_status as enum ('open', 'in_progress', 'waiting_customer', 'resolved', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'device_unit_status') then
    create type public.device_unit_status as enum ('available', 'reserved', 'sold', 'returned', 'defective', 'in_assistance');
  end if;

  if not exists (select 1 from pg_type where typname = 'identifier_type') then
    create type public.identifier_type as enum ('imei', 'serial', 'meid', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'purchase_entry_status') then
    create type public.purchase_entry_status as enum ('draft', 'received', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'document_type') then
    create type public.document_type as enum ('cpf', 'cnpj', 'rg', 'passport', 'other');
  end if;
end$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  permission_key text not null unique,
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  phone text,
  job_title text,
  status public.user_status not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, role_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext,
  phone text,
  mobile text,
  whatsapp text,
  document text,
  document_type public.document_type,
  birth_date date,
  gender text check (gender in ('M', 'F')),
  status public.customer_status not null default 'active',
  notes text,
  tags text[] not null default '{}',
  total_orders integer not null default 0,
  total_spent numeric(12, 2) not null default 0,
  last_purchase_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text,
  street text not null,
  number text,
  complement text,
  neighborhood text,
  city text not null,
  state text not null,
  postal_code text,
  country text not null default 'Brasil',
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  note text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  logo_url text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text unique,
  barcode text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  status public.product_status not null default 'active',
  cost_price numeric(12, 2),
  sale_price numeric(12, 2) not null default 0,
  promotional_price numeric(12, 2),
  min_stock integer not null default 0,
  max_stock integer,
  weight numeric(10, 3),
  dimensions jsonb not null default '{}'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  warranty_months integer,
  is_trackable boolean not null default false,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique,
  barcode text,
  attributes jsonb not null default '{}'::jsonb,
  cost_price numeric(12, 2),
  sale_price numeric(12, 2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document text,
  email citext,
  phone text,
  contact_name text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  min_stock integer not null default 0,
  max_stock integer,
  average_cost numeric(12, 2),
  last_movement_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, product_variant_id)
);

create table if not exists public.purchase_entries (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  entry_number text not null unique,
  invoice_number text,
  status public.purchase_entry_status not null default 'received',
  entry_date date not null default current_date,
  notes text,
  total_cost numeric(12, 2) not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.purchase_entry_items (
  id uuid primary key default gen_random_uuid(),
  purchase_entry_id uuid not null references public.purchase_entries(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_cost numeric(12, 2) not null default 0,
  total_cost numeric(12, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  product_id uuid not null references public.products(id) on delete restrict,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  movement_type public.stock_movement_type not null,
  quantity integer not null,
  previous_quantity integer not null default 0,
  new_quantity integer not null default 0,
  unit_cost numeric(12, 2),
  total_cost numeric(12, 2),
  reference_type text,
  reference_id uuid,
  notes text,
  performed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.device_units (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  purchase_entry_item_id uuid references public.purchase_entry_items(id) on delete set null,
  status public.device_unit_status not null default 'available',
  cost_price numeric(12, 2),
  sale_price numeric(12, 2),
  purchased_at timestamptz,
  sold_at timestamptz,
  warranty_until date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.device_identifiers (
  id uuid primary key default gen_random_uuid(),
  device_unit_id uuid not null references public.device_units(id) on delete cascade,
  identifier_type public.identifier_type not null,
  identifier_value text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (identifier_type, identifier_value)
);

create table if not exists public.imei_records (
  id uuid primary key default gen_random_uuid(),
  device_unit_id uuid not null unique references public.device_units(id) on delete cascade,
  imei text not null unique,
  status public.device_unit_status not null default 'available',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.serial_records (
  id uuid primary key default gen_random_uuid(),
  device_unit_id uuid not null unique references public.device_units(id) on delete cascade,
  serial_number text not null unique,
  status public.device_unit_status not null default 'available',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  seller_id uuid references public.profiles(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  payment_method public.payment_method,
  subtotal numeric(12, 2) not null default 0,
  discount_amount numeric(12, 2) not null default 0,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  shipping_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  notes text,
  internal_notes text,
  confirmed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_variant_id uuid references public.product_variants(id) on delete set null,
  device_unit_id uuid references public.device_units(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12, 2) not null default 0,
  discount_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  cost_amount numeric(12, 2),
  warranty_until date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method public.payment_method not null,
  status public.payment_status not null default 'pending',
  amount numeric(12, 2) not null default 0,
  installment_count integer not null default 1,
  transaction_reference text,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  notes text,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cash_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  account_type text not null default 'cash',
  current_balance numeric(12, 2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.accounts_payable (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null,
  status public.payment_status not null default 'pending',
  due_date date not null,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.accounts_receivable (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null,
  status public.payment_status not null default 'pending',
  due_date date not null,
  received_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  cash_account_id uuid references public.cash_accounts(id) on delete set null,
  transaction_type public.financial_transaction_type not null,
  description text not null,
  amount numeric(12, 2) not null,
  occurred_at timestamptz not null default timezone('utc', now()),
  category text,
  order_id uuid references public.orders(id) on delete set null,
  accounts_payable_id uuid references public.accounts_payable(id) on delete set null,
  accounts_receivable_id uuid references public.accounts_receivable(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete set null,
  device_unit_id uuid references public.device_units(id) on delete set null,
  status public.warranty_status not null default 'valid',
  warranty_start date,
  warranty_end date,
  terms text,
  notes text,
  claimed_at timestamptz,
  claim_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  device_unit_id uuid references public.device_units(id) on delete set null,
  title text not null,
  description text not null,
  status public.support_ticket_status not null default 'open',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  opened_by uuid references public.profiles(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.technical_assistance_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  device_unit_id uuid references public.device_units(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  status public.assistance_order_status not null default 'pending',
  issue_description text not null,
  diagnosis text,
  solution text,
  estimated_cost numeric(12, 2),
  final_cost numeric(12, 2),
  assigned_to uuid references public.profiles(id) on delete set null,
  started_at timestamptz,
  finished_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  description text,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);
create index if not exists idx_customers_status on public.customers(status);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_document on public.customers(document);
create index if not exists idx_customer_addresses_customer_id on public.customer_addresses(customer_id);
create index if not exists idx_customer_notes_customer_id on public.customer_notes(customer_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_brand_id on public.products(brand_id);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_inventory_items_product_id on public.inventory_items(product_id);
create index if not exists idx_inventory_movements_product_id on public.inventory_movements(product_id);
create index if not exists idx_inventory_movements_reference on public.inventory_movements(reference_type, reference_id);
create index if not exists idx_device_units_product_id on public.device_units(product_id);
create index if not exists idx_device_units_status on public.device_units(status);
create index if not exists idx_device_identifiers_value on public.device_identifiers(identifier_value);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_seller_id on public.orders(seller_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_payments_order_id on public.order_payments(order_id);
create index if not exists idx_financial_transactions_cash_account_id on public.financial_transactions(cash_account_id);
create index if not exists idx_financial_transactions_occurred_at on public.financial_transactions(occurred_at);
create index if not exists idx_accounts_payable_due_date on public.accounts_payable(due_date);
create index if not exists idx_accounts_receivable_due_date on public.accounts_receivable(due_date);
create index if not exists idx_warranties_customer_id on public.warranties(customer_id);
create index if not exists idx_support_tickets_customer_id on public.support_tickets(customer_id);
create index if not exists idx_technical_assistance_orders_customer_id on public.technical_assistance_orders(customer_id);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

drop trigger if exists set_updated_at_roles on public.roles;
create trigger set_updated_at_roles before update on public.roles for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_permissions on public.permissions;
create trigger set_updated_at_permissions before update on public.permissions for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_customers on public.customers;
create trigger set_updated_at_customers before update on public.customers for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_customer_addresses on public.customer_addresses;
create trigger set_updated_at_customer_addresses before update on public.customer_addresses for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_customer_notes on public.customer_notes;
create trigger set_updated_at_customer_notes before update on public.customer_notes for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_brands on public.brands;
create trigger set_updated_at_brands before update on public.brands for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_product_variants on public.product_variants;
create trigger set_updated_at_product_variants before update on public.product_variants for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_product_images on public.product_images;
create trigger set_updated_at_product_images before update on public.product_images for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_suppliers on public.suppliers;
create trigger set_updated_at_suppliers before update on public.suppliers for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_inventory_items on public.inventory_items;
create trigger set_updated_at_inventory_items before update on public.inventory_items for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_purchase_entries on public.purchase_entries;
create trigger set_updated_at_purchase_entries before update on public.purchase_entries for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_purchase_entry_items on public.purchase_entry_items;
create trigger set_updated_at_purchase_entry_items before update on public.purchase_entry_items for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_inventory_movements on public.inventory_movements;
create trigger set_updated_at_inventory_movements before update on public.inventory_movements for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_device_units on public.device_units;
create trigger set_updated_at_device_units before update on public.device_units for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_device_identifiers on public.device_identifiers;
create trigger set_updated_at_device_identifiers before update on public.device_identifiers for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_imei_records on public.imei_records;
create trigger set_updated_at_imei_records before update on public.imei_records for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_serial_records on public.serial_records;
create trigger set_updated_at_serial_records before update on public.serial_records for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_orders on public.orders;
create trigger set_updated_at_orders before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_order_items on public.order_items;
create trigger set_updated_at_order_items before update on public.order_items for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_order_payments on public.order_payments;
create trigger set_updated_at_order_payments before update on public.order_payments for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_order_status_history on public.order_status_history;
create trigger set_updated_at_order_status_history before update on public.order_status_history for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_cash_accounts on public.cash_accounts;
create trigger set_updated_at_cash_accounts before update on public.cash_accounts for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_accounts_payable on public.accounts_payable;
create trigger set_updated_at_accounts_payable before update on public.accounts_payable for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_accounts_receivable on public.accounts_receivable;
create trigger set_updated_at_accounts_receivable before update on public.accounts_receivable for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_financial_transactions on public.financial_transactions;
create trigger set_updated_at_financial_transactions before update on public.financial_transactions for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_warranties on public.warranties;
create trigger set_updated_at_warranties before update on public.warranties for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_support_tickets on public.support_tickets;
create trigger set_updated_at_support_tickets before update on public.support_tickets for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_technical_assistance_orders on public.technical_assistance_orders;
create trigger set_updated_at_technical_assistance_orders before update on public.technical_assistance_orders for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_app_settings on public.app_settings;
create trigger set_updated_at_app_settings before update on public.app_settings for each row execute function public.set_updated_at();

commit;
