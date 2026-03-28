# Auth And RLS

## Access Model
Authentication is handled by Supabase Auth. Authorization is layered:

1. `profiles` extends the authenticated user record.
2. `user_roles` links each profile to one or more roles.
3. `role_permissions` resolves granular permission keys.
4. Nuxt middleware blocks unauthorized navigation.
5. Postgres RLS protects the underlying data.

## Seeded Roles
- `admin`
- `manager`
- `seller`
- `inventory`
- `finance`
- `support`

## Seeded Permission Families
- `customers.*`
- `products.*`
- `inventory.*`
- `orders.*`
- `finance.*`
- `settings.manage`
- `users.manage`
- `support.manage`
- `warranties.manage`
- `reports.read`
- `brands.manage`
- `categories.manage`
- `suppliers.manage`

## Helper SQL Functions
Defined in `supabase/migrations/202603290002_crm_security_and_seeds.sql`:

- `current_user_has_role(role_slug text)`
- `current_user_is_admin()`
- `current_user_has_permission(permission_name text)`
- `handle_new_user()`

## First User Bootstrap
The `handle_new_user()` trigger runs on `auth.users` insert and:
- creates or updates the matching `profiles` row
- assigns the `admin` role to the first created profile

## RLS Strategy
RLS is enabled on the operational tables and uses the helper SQL functions above.

### Practical policy pattern
- Read policies: authenticated users with read permission or admin role
- Write policies: only users with the matching `*.create`, `*.update`, or `*.manage` capability
- Sensitive tables: admin-only or admin plus explicit management permission

## Tables Protected By RLS
- `profiles`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `customers`
- `customer_addresses`
- `customer_notes`
- `brands`
- `categories`
- `products`
- `product_variants`
- `product_images`
- `suppliers`
- `inventory_items`
- `inventory_movements`
- `purchase_entries`
- `purchase_entry_items`
- `device_units`
- `device_identifiers`
- `imei_records`
- `serial_records`
- `orders`
- `order_items`
- `order_payments`
- `order_status_history`
- `cash_accounts`
- `financial_transactions`
- `accounts_payable`
- `accounts_receivable`
- `warranties`
- `support_tickets`
- `technical_assistance_orders`
- `audit_logs`
- `app_settings`

## Nuxt Authorization Layer
- `app/composables/useAuth.ts` loads session, profile, roles, and permissions.
- `app/composables/usePermissions.ts` exposes `can`, `canSome`, `canEvery`, `hasRole`, and `isAdmin`.
- `app/middleware/auth.ts` protects authenticated areas and blocks users with profile status `blocked`.
- `app/middleware/admin.ts` restricts admin-level sections.

## Hardening Notes
- Current policies are suitable for an internal single-tenant CRM.
- If the system evolves to multi-store or multi-tenant, add explicit store ownership columns and scope every policy by tenant id.
