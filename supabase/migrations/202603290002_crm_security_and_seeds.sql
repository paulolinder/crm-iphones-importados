begin;

insert into public.roles (slug, name, description)
values
  ('admin', 'Administrador', 'Acesso total ao sistema'),
  ('manager', 'Gerente', 'Gestão operacional e relatórios'),
  ('seller', 'Vendedor', 'Operação comercial e pedidos'),
  ('inventory', 'Estoque', 'Operação de estoque e entradas'),
  ('finance', 'Financeiro', 'Operação financeira'),
  ('support', 'Suporte', 'Pós-venda, garantias e assistência')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  updated_at = timezone('utc', now());

insert into public.permissions (permission_key, module, action, description)
values
  ('customers.read', 'customers', 'read', 'Visualizar clientes'),
  ('customers.create', 'customers', 'create', 'Criar clientes'),
  ('customers.update', 'customers', 'update', 'Atualizar clientes'),
  ('customers.delete', 'customers', 'delete', 'Excluir clientes'),
  ('products.read', 'products', 'read', 'Visualizar produtos'),
  ('products.create', 'products', 'create', 'Criar produtos'),
  ('products.update', 'products', 'update', 'Atualizar produtos'),
  ('products.delete', 'products', 'delete', 'Excluir produtos'),
  ('inventory.read', 'inventory', 'read', 'Visualizar estoque'),
  ('inventory.update', 'inventory', 'update', 'Movimentar estoque'),
  ('orders.read', 'orders', 'read', 'Visualizar pedidos'),
  ('orders.create', 'orders', 'create', 'Criar pedidos'),
  ('orders.update', 'orders', 'update', 'Atualizar pedidos'),
  ('finance.read', 'finance', 'read', 'Visualizar financeiro'),
  ('finance.update', 'finance', 'update', 'Atualizar financeiro'),
  ('settings.manage', 'settings', 'manage', 'Gerenciar configurações'),
  ('users.manage', 'users', 'manage', 'Gerenciar usuários e permissões'),
  ('support.manage', 'support', 'manage', 'Gerenciar suporte e assistência'),
  ('warranties.manage', 'warranties', 'manage', 'Gerenciar garantias'),
  ('reports.read', 'reports', 'read', 'Visualizar relatórios'),
  ('brands.manage', 'catalog', 'manage', 'Gerenciar marcas'),
  ('categories.manage', 'catalog', 'manage', 'Gerenciar categorias'),
  ('suppliers.manage', 'suppliers', 'manage', 'Gerenciar fornecedores')
on conflict (permission_key) do update
set
  module = excluded.module,
  action = excluded.action,
  description = excluded.description,
  updated_at = timezone('utc', now());

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug = 'admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.permission_key in (
  'customers.read',
  'customers.create',
  'customers.update',
  'products.read',
  'products.create',
  'products.update',
  'inventory.read',
  'inventory.update',
  'orders.read',
  'orders.create',
  'orders.update',
  'finance.read',
  'finance.update',
  'settings.manage',
  'reports.read',
  'support.manage',
  'warranties.manage',
  'brands.manage',
  'categories.manage',
  'suppliers.manage'
)
where r.slug = 'manager'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.permission_key in (
  'customers.read',
  'customers.create',
  'customers.update',
  'products.read',
  'inventory.read',
  'orders.read',
  'orders.create',
  'orders.update',
  'reports.read'
)
where r.slug = 'seller'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.permission_key in (
  'products.read',
  'inventory.read',
  'inventory.update',
  'suppliers.manage',
  'brands.manage',
  'categories.manage'
)
where r.slug = 'inventory'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.permission_key in (
  'customers.read',
  'orders.read',
  'finance.read',
  'finance.update',
  'reports.read'
)
where r.slug = 'finance'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.permission_key in (
  'customers.read',
  'orders.read',
  'products.read',
  'support.manage',
  'warranties.manage'
)
where r.slug = 'support'
on conflict do nothing;

insert into public.brands (name, slug, description)
values
  ('Apple', 'apple', 'Marca principal de iPhones e acessórios'),
  ('Samsung', 'samsung', 'Acessórios e dispositivos complementares'),
  ('JBL', 'jbl', 'Áudio e acessórios')
on conflict (slug) do nothing;

insert into public.categories (name, slug, description, sort_order)
values
  ('iPhones', 'iphones', 'Smartphones Apple', 1),
  ('Acessórios', 'acessorios', 'Cabos, fones e carregadores', 2),
  ('Wearables', 'wearables', 'Relógios e acessórios vestíveis', 3),
  ('Notebooks', 'notebooks', 'Computadores e notebooks', 4),
  ('Tablets', 'tablets', 'Tablets e iPads', 5)
on conflict (slug) do nothing;

insert into public.cash_accounts (name, slug, account_type, current_balance)
values
  ('Caixa Principal', 'caixa-principal', 'cash', 0),
  ('Conta Bancária', 'conta-bancaria', 'bank', 0),
  ('PIX', 'pix', 'digital', 0)
on conflict (slug) do nothing;

insert into public.app_settings (setting_key, setting_value, description, is_public)
values
  ('app.name', '"Eleve Imports CRM"'::jsonb, 'Nome da aplicação', true),
  ('app.currency', '"BRL"'::jsonb, 'Moeda padrão', true),
  ('store.country', '"Brasil"'::jsonb, 'País padrão da loja', false),
  ('orders.default_warranty_months', '3'::jsonb, 'Garantia padrão em meses', false)
on conflict (setting_key) do update
set
  setting_value = excluded.setting_value,
  description = excluded.description,
  is_public = excluded.is_public,
  updated_at = timezone('utc', now());

create or replace function public.current_user_has_role(role_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.slug = role_slug
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_has_role('admin');
$$;

create or replace function public.current_user_has_permission(permission_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.current_user_is_admin()
    or exists (
      select 1
      from public.user_roles ur
      join public.role_permissions rp on rp.role_id = ur.role_id
      join public.permissions p on p.id = rp.permission_id
      where ur.user_id = auth.uid()
        and p.permission_key = permission_name
    );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_role_id uuid;
begin
  insert into public.profiles (id, email, first_name, last_name, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do update
  set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    full_name = excluded.full_name,
    updated_at = timezone('utc', now());

  if (select count(*) from public.profiles) = 1 then
    select id into admin_role_id from public.roles where slug = 'admin' limit 1;

    if admin_role_id is not null then
      insert into public.user_roles (user_id, role_id)
      values (new.id, admin_role_id)
      on conflict (user_id, role_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.customer_notes enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.suppliers enable row level security;
alter table public.inventory_items enable row level security;
alter table public.purchase_entries enable row level security;
alter table public.purchase_entry_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.device_units enable row level security;
alter table public.device_identifiers enable row level security;
alter table public.imei_records enable row level security;
alter table public.serial_records enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_payments enable row level security;
alter table public.order_status_history enable row level security;
alter table public.cash_accounts enable row level security;
alter table public.accounts_payable enable row level security;
alter table public.accounts_receivable enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.warranties enable row level security;
alter table public.support_tickets enable row level security;
alter table public.technical_assistance_orders enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists roles_read_authenticated on public.roles;
create policy roles_read_authenticated on public.roles
for select using (auth.uid() is not null);

drop policy if exists roles_manage_admin on public.roles;
create policy roles_manage_admin on public.roles
for all using (public.current_user_has_permission('users.manage'))
with check (public.current_user_has_permission('users.manage'));

drop policy if exists permissions_read_authenticated on public.permissions;
create policy permissions_read_authenticated on public.permissions
for select using (auth.uid() is not null);

drop policy if exists permissions_manage_admin on public.permissions;
create policy permissions_manage_admin on public.permissions
for all using (public.current_user_has_permission('users.manage'))
with check (public.current_user_has_permission('users.manage'));

drop policy if exists role_permissions_read_authenticated on public.role_permissions;
create policy role_permissions_read_authenticated on public.role_permissions
for select using (auth.uid() is not null);

drop policy if exists role_permissions_manage_admin on public.role_permissions;
create policy role_permissions_manage_admin on public.role_permissions
for all using (public.current_user_has_permission('users.manage'))
with check (public.current_user_has_permission('users.manage'));

drop policy if exists user_roles_read_authenticated on public.user_roles;
create policy user_roles_read_authenticated on public.user_roles
for select using (auth.uid() is not null);

drop policy if exists user_roles_manage_admin on public.user_roles;
create policy user_roles_manage_admin on public.user_roles
for all using (public.current_user_has_permission('users.manage'))
with check (public.current_user_has_permission('users.manage'));

drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
for select using (auth.uid() = id or public.current_user_has_permission('users.manage'));

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin on public.profiles
for update using (auth.uid() = id or public.current_user_has_permission('users.manage'))
with check (auth.uid() = id or public.current_user_has_permission('users.manage'));

drop policy if exists profiles_insert_admin on public.profiles;
create policy profiles_insert_admin on public.profiles
for insert with check (public.current_user_has_permission('users.manage'));

drop policy if exists customers_read_authenticated on public.customers;
create policy customers_read_authenticated on public.customers
for select using (auth.uid() is not null);

drop policy if exists customers_insert_policy on public.customers;
create policy customers_insert_policy on public.customers
for insert with check (public.current_user_has_permission('customers.create'));

drop policy if exists customers_update_policy on public.customers;
create policy customers_update_policy on public.customers
for update using (public.current_user_has_permission('customers.update'))
with check (public.current_user_has_permission('customers.update'));

drop policy if exists customers_delete_policy on public.customers;
create policy customers_delete_policy on public.customers
for delete using (public.current_user_has_permission('customers.delete'));

drop policy if exists customer_addresses_read_authenticated on public.customer_addresses;
create policy customer_addresses_read_authenticated on public.customer_addresses
for select using (auth.uid() is not null);

drop policy if exists customer_addresses_manage_customers on public.customer_addresses;
create policy customer_addresses_manage_customers on public.customer_addresses
for all using (public.current_user_has_permission('customers.update'))
with check (public.current_user_has_permission('customers.update'));

drop policy if exists customer_notes_read_authenticated on public.customer_notes;
create policy customer_notes_read_authenticated on public.customer_notes
for select using (auth.uid() is not null);

drop policy if exists customer_notes_manage_customers on public.customer_notes;
create policy customer_notes_manage_customers on public.customer_notes
for all using (public.current_user_has_permission('customers.update'))
with check (public.current_user_has_permission('customers.update'));

drop policy if exists brands_read_authenticated on public.brands;
create policy brands_read_authenticated on public.brands
for select using (auth.uid() is not null);

drop policy if exists brands_manage_policy on public.brands;
create policy brands_manage_policy on public.brands
for all using (public.current_user_has_permission('brands.manage') or public.current_user_has_permission('settings.manage'))
with check (public.current_user_has_permission('brands.manage') or public.current_user_has_permission('settings.manage'));

drop policy if exists categories_read_authenticated on public.categories;
create policy categories_read_authenticated on public.categories
for select using (auth.uid() is not null);

drop policy if exists categories_manage_policy on public.categories;
create policy categories_manage_policy on public.categories
for all using (public.current_user_has_permission('categories.manage') or public.current_user_has_permission('settings.manage'))
with check (public.current_user_has_permission('categories.manage') or public.current_user_has_permission('settings.manage'));

drop policy if exists products_read_authenticated on public.products;
create policy products_read_authenticated on public.products
for select using (auth.uid() is not null);

drop policy if exists products_insert_policy on public.products;
create policy products_insert_policy on public.products
for insert with check (public.current_user_has_permission('products.create'));

drop policy if exists products_update_policy on public.products;
create policy products_update_policy on public.products
for update using (public.current_user_has_permission('products.update'))
with check (public.current_user_has_permission('products.update'));

drop policy if exists products_delete_policy on public.products;
create policy products_delete_policy on public.products
for delete using (public.current_user_has_permission('products.delete'));

drop policy if exists product_variants_read_authenticated on public.product_variants;
create policy product_variants_read_authenticated on public.product_variants
for select using (auth.uid() is not null);

drop policy if exists product_variants_manage_policy on public.product_variants;
create policy product_variants_manage_policy on public.product_variants
for all using (public.current_user_has_permission('products.update'))
with check (public.current_user_has_permission('products.update'));

drop policy if exists product_images_read_authenticated on public.product_images;
create policy product_images_read_authenticated on public.product_images
for select using (auth.uid() is not null);

drop policy if exists product_images_manage_policy on public.product_images;
create policy product_images_manage_policy on public.product_images
for all using (public.current_user_has_permission('products.update'))
with check (public.current_user_has_permission('products.update'));

drop policy if exists suppliers_read_authenticated on public.suppliers;
create policy suppliers_read_authenticated on public.suppliers
for select using (auth.uid() is not null);

drop policy if exists suppliers_manage_policy on public.suppliers;
create policy suppliers_manage_policy on public.suppliers
for all using (public.current_user_has_permission('suppliers.manage') or public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('suppliers.manage') or public.current_user_has_permission('inventory.update'));

drop policy if exists inventory_items_read_authenticated on public.inventory_items;
create policy inventory_items_read_authenticated on public.inventory_items
for select using (auth.uid() is not null);

drop policy if exists inventory_items_manage_policy on public.inventory_items;
create policy inventory_items_manage_policy on public.inventory_items
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists purchase_entries_read_authenticated on public.purchase_entries;
create policy purchase_entries_read_authenticated on public.purchase_entries
for select using (auth.uid() is not null);

drop policy if exists purchase_entries_manage_policy on public.purchase_entries;
create policy purchase_entries_manage_policy on public.purchase_entries
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists purchase_entry_items_read_authenticated on public.purchase_entry_items;
create policy purchase_entry_items_read_authenticated on public.purchase_entry_items
for select using (auth.uid() is not null);

drop policy if exists purchase_entry_items_manage_policy on public.purchase_entry_items;
create policy purchase_entry_items_manage_policy on public.purchase_entry_items
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists inventory_movements_read_authenticated on public.inventory_movements;
create policy inventory_movements_read_authenticated on public.inventory_movements
for select using (auth.uid() is not null);

drop policy if exists inventory_movements_manage_policy on public.inventory_movements;
create policy inventory_movements_manage_policy on public.inventory_movements
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists device_units_read_authenticated on public.device_units;
create policy device_units_read_authenticated on public.device_units
for select using (auth.uid() is not null);

drop policy if exists device_units_manage_policy on public.device_units;
create policy device_units_manage_policy on public.device_units
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists device_identifiers_read_authenticated on public.device_identifiers;
create policy device_identifiers_read_authenticated on public.device_identifiers
for select using (auth.uid() is not null);

drop policy if exists device_identifiers_manage_policy on public.device_identifiers;
create policy device_identifiers_manage_policy on public.device_identifiers
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists imei_records_read_authenticated on public.imei_records;
create policy imei_records_read_authenticated on public.imei_records
for select using (auth.uid() is not null);

drop policy if exists imei_records_manage_policy on public.imei_records;
create policy imei_records_manage_policy on public.imei_records
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists serial_records_read_authenticated on public.serial_records;
create policy serial_records_read_authenticated on public.serial_records
for select using (auth.uid() is not null);

drop policy if exists serial_records_manage_policy on public.serial_records;
create policy serial_records_manage_policy on public.serial_records
for all using (public.current_user_has_permission('inventory.update'))
with check (public.current_user_has_permission('inventory.update'));

drop policy if exists orders_read_authenticated on public.orders;
create policy orders_read_authenticated on public.orders
for select using (auth.uid() is not null);

drop policy if exists orders_insert_policy on public.orders;
create policy orders_insert_policy on public.orders
for insert with check (public.current_user_has_permission('orders.create'));

drop policy if exists orders_update_policy on public.orders;
create policy orders_update_policy on public.orders
for update using (public.current_user_has_permission('orders.update'))
with check (public.current_user_has_permission('orders.update'));

drop policy if exists order_items_read_authenticated on public.order_items;
create policy order_items_read_authenticated on public.order_items
for select using (auth.uid() is not null);

drop policy if exists order_items_manage_policy on public.order_items;
create policy order_items_manage_policy on public.order_items
for all using (public.current_user_has_permission('orders.update') or public.current_user_has_permission('orders.create'))
with check (public.current_user_has_permission('orders.update') or public.current_user_has_permission('orders.create'));

drop policy if exists order_payments_read_authenticated on public.order_payments;
create policy order_payments_read_authenticated on public.order_payments
for select using (auth.uid() is not null);

drop policy if exists order_payments_manage_policy on public.order_payments;
create policy order_payments_manage_policy on public.order_payments
for all using (public.current_user_has_permission('orders.update') or public.current_user_has_permission('finance.update'))
with check (public.current_user_has_permission('orders.update') or public.current_user_has_permission('finance.update'));

drop policy if exists order_status_history_read_authenticated on public.order_status_history;
create policy order_status_history_read_authenticated on public.order_status_history
for select using (auth.uid() is not null);

drop policy if exists order_status_history_manage_policy on public.order_status_history;
create policy order_status_history_manage_policy on public.order_status_history
for all using (public.current_user_has_permission('orders.update'))
with check (public.current_user_has_permission('orders.update'));

drop policy if exists cash_accounts_read_finance on public.cash_accounts;
create policy cash_accounts_read_finance on public.cash_accounts
for select using (public.current_user_has_permission('finance.read'));

drop policy if exists cash_accounts_manage_finance on public.cash_accounts;
create policy cash_accounts_manage_finance on public.cash_accounts
for all using (public.current_user_has_permission('finance.update'))
with check (public.current_user_has_permission('finance.update'));

drop policy if exists accounts_payable_read_finance on public.accounts_payable;
create policy accounts_payable_read_finance on public.accounts_payable
for select using (public.current_user_has_permission('finance.read'));

drop policy if exists accounts_payable_manage_finance on public.accounts_payable;
create policy accounts_payable_manage_finance on public.accounts_payable
for all using (public.current_user_has_permission('finance.update'))
with check (public.current_user_has_permission('finance.update'));

drop policy if exists accounts_receivable_read_finance on public.accounts_receivable;
create policy accounts_receivable_read_finance on public.accounts_receivable
for select using (public.current_user_has_permission('finance.read'));

drop policy if exists accounts_receivable_manage_finance on public.accounts_receivable;
create policy accounts_receivable_manage_finance on public.accounts_receivable
for all using (public.current_user_has_permission('finance.update'))
with check (public.current_user_has_permission('finance.update'));

drop policy if exists financial_transactions_read_finance on public.financial_transactions;
create policy financial_transactions_read_finance on public.financial_transactions
for select using (public.current_user_has_permission('finance.read'));

drop policy if exists financial_transactions_manage_finance on public.financial_transactions;
create policy financial_transactions_manage_finance on public.financial_transactions
for all using (public.current_user_has_permission('finance.update'))
with check (public.current_user_has_permission('finance.update'));

drop policy if exists warranties_read_authenticated on public.warranties;
create policy warranties_read_authenticated on public.warranties
for select using (auth.uid() is not null);

drop policy if exists warranties_manage_policy on public.warranties;
create policy warranties_manage_policy on public.warranties
for all using (public.current_user_has_permission('warranties.manage'))
with check (public.current_user_has_permission('warranties.manage'));

drop policy if exists support_tickets_read_authenticated on public.support_tickets;
create policy support_tickets_read_authenticated on public.support_tickets
for select using (auth.uid() is not null);

drop policy if exists support_tickets_manage_policy on public.support_tickets;
create policy support_tickets_manage_policy on public.support_tickets
for all using (public.current_user_has_permission('support.manage'))
with check (public.current_user_has_permission('support.manage'));

drop policy if exists technical_assistance_read_authenticated on public.technical_assistance_orders;
create policy technical_assistance_read_authenticated on public.technical_assistance_orders
for select using (auth.uid() is not null);

drop policy if exists technical_assistance_manage_policy on public.technical_assistance_orders;
create policy technical_assistance_manage_policy on public.technical_assistance_orders
for all using (public.current_user_has_permission('support.manage'))
with check (public.current_user_has_permission('support.manage'));

drop policy if exists audit_logs_read_admin on public.audit_logs;
create policy audit_logs_read_admin on public.audit_logs
for select using (public.current_user_is_admin() or public.current_user_has_permission('users.manage'));

drop policy if exists audit_logs_insert_authenticated on public.audit_logs;
create policy audit_logs_insert_authenticated on public.audit_logs
for insert with check (auth.uid() is not null);

drop policy if exists app_settings_read_policy on public.app_settings;
create policy app_settings_read_policy on public.app_settings
for select using (is_public = true or public.current_user_has_permission('settings.manage'));

drop policy if exists app_settings_manage_policy on public.app_settings;
create policy app_settings_manage_policy on public.app_settings
for all using (public.current_user_has_permission('settings.manage'))
with check (public.current_user_has_permission('settings.manage'));

commit;
