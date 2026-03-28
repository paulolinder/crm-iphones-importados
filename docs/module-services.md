# Module Services

## Structure
Each business domain follows the same pattern:

- `domains/<module>/types`
- `domains/<module>/validation`
- `domains/<module>/services`
- `domains/<module>/composables`

Shared helpers live in `domains/shared/service-utils.ts`.

## Implemented Modules
### Auth
- `domains/auth/services/index.ts`
- `domains/auth/types/index.ts`

Responsibilities:
- load current profile
- resolve roles and permissions for the authenticated user

### Clientes
- `domains/clientes/services/index.ts`
- `domains/clientes/composables/useCustomers.ts`
- `domains/clientes/validation/index.ts`

Responsibilities:
- list and paginate customers
- get customer by id
- create and update customer
- deactivate and soft delete
- list addresses
- save notes
- aggregate customer stats

### Produtos
- `domains/produtos/services/index.ts`
- `domains/produtos/composables/useProducts.ts`
- `domains/produtos/validation/index.ts`

Responsibilities:
- list products with filters
- create and update product records
- change product status
- list brands and categories
- create initial stock record when needed

### Estoque
- `domains/estoque/services/index.ts`
- `domains/estoque/composables/useInventory.ts`
- `domains/estoque/validation/index.ts`

Responsibilities:
- stock overview
- movement history
- stock entry registration
- device unit creation for tracked products
- inventory totals and low-stock signals

### Vendas
- `domains/vendas/services/index.ts`
- `domains/vendas/composables/useOrders.ts`
- `domains/vendas/validation/index.ts`

Responsibilities:
- list orders
- create orders with items
- calculate totals
- register payments
- update order status and history
- synchronize customer totals and stock

### Financeiro
- `domains/financeiro/services/index.ts`
- `domains/financeiro/composables/useFinance.ts`
- `domains/financeiro/validation/index.ts`

Responsibilities:
- list financial transactions
- register income and expense entries
- register payables and receivables
- compute summary totals

## UI Connected In This Stage
- `app/pages/admin/clientes/index.vue`
- `app/pages/admin/clientes/novo.vue`
- `app/pages/admin/clientes/[id]/editar.vue`
- `app/pages/admin/produtos/index.vue`
- `app/pages/admin/produtos/novo.vue`
- `app/pages/admin/produtos/[id]/editar.vue`
- `app/pages/admin/estoque/index.vue`
- `app/pages/admin/estoque/entrada.vue`
- `app/pages/admin/vendas/index.vue`
- `app/pages/admin/vendas/nova.vue`
- `app/pages/admin/financeiro/index.vue`
- `app/pages/login.vue`

## Validation Pattern
- Services validate payloads before persistence.
- Pages keep presentation concerns only and delegate mutation logic to services/composables.
- Types come from Supabase schema plus domain-level DTOs.

## Reusable Helpers
`domains/shared/service-utils.ts` centralizes:
- `assertSupabaseResult`
- `getPaginationRange`
- `buildPaginatedResponse`
- `normalizeCurrencyValue`
