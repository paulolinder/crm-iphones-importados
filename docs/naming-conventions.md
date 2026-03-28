# Convenções de Nomenclatura

## Visão Geral

Manter uma nomenclatura consistente é essencial para a manutenibilidade e legibilidade do código. Este documento define os padrões de nomenclatura para todo o projeto.

## Arquivos e Pastas

### Componentes Vue

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Base components | `Base{Nome}.vue` | `BaseButton.vue`, `BaseInput.vue` |
| Layout components | `App{Nome}.vue` | `AppSidebar.vue`, `AppHeader.vue` |
| Shared components | `{Nome}.vue` (PascalCase) | `LoadingState.vue`, `StatusBadge.vue` |
| Page components | `index.vue` ou `[param].vue` | `index.vue`, `[id].vue` |

### Composables

```
use{Nome}.ts
```

Exemplos:
- `useAuth.ts`
- `useSupabase.ts`
- `usePagination.ts`
- `useCustomers.ts`

### Services

```
{nome}Service.ts  ou  index.ts (dentro da pasta services/)
```

Exemplos:
- `modules/clientes/services/index.ts`
- `lib/services/emailService.ts`

### Types

```
{contexto}.ts  ou  index.ts
```

Exemplos:
- `types/global/index.ts`
- `types/global/status.ts`
- `modules/clientes/types/index.ts`

### Stores (Pinia)

```
use{Nome}Store.ts
```

Exemplos:
- `useAuthStore.ts`
- `useCartStore.ts`

### Constantes

```
{contexto}.ts  ou  index.ts
```

Exemplos:
- `constants/index.ts`
- `modules/clientes/constants/index.ts`

## Código TypeScript/JavaScript

### Variáveis e Funções

```typescript
// camelCase para variáveis e funções
const userName = 'João'
const isLoading = false

function fetchCustomers() { }
const handleSubmit = () => { }
```

### Constantes (valores imutáveis)

```typescript
// SCREAMING_SNAKE_CASE para constantes globais
const MAX_ITEMS_PER_PAGE = 50
const API_BASE_URL = 'https://api.example.com'

// Arrays/Objects constantes podem usar camelCase
const statusOptions = ['active', 'inactive'] as const
```

### Interfaces e Types

```typescript
// PascalCase para interfaces e types
interface Customer {
  id: string
  name: string
}

type OrderStatus = 'pending' | 'confirmed'

// Prefixo Props para props de componentes
interface Props {
  value: string
}

// Sufixo FormData para dados de formulário
interface CustomerFormData {
  name: string
  email: string
}
```

### Enums

```typescript
// PascalCase para enum e membros
enum PaymentMethod {
  Cash = 'cash',
  CreditCard = 'credit_card',
  Pix = 'pix',
}
```

### Composables

```typescript
// Prefixo 'use' obrigatório
export function useAuth() { }
export function usePagination() { }

// Retorno: usar readonly para estado
return {
  data: readonly(data),
  loading: readonly(loading),
  fetchData,
}
```

## Páginas e Rotas

### Estrutura de Pastas

```
pages/
├── index.vue              → /
├── login.vue              → /login
└── admin/
    ├── index.vue          → /admin
    ├── dashboard/
    │   └── index.vue      → /admin/dashboard
    ├── clientes/
    │   ├── index.vue      → /admin/clientes
    │   ├── novo.vue       → /admin/clientes/novo
    │   └── [id]/
    │       ├── index.vue  → /admin/clientes/:id
    │       └── editar.vue → /admin/clientes/:id/editar
```

### Convenções

| Conceito | Padrão | Exemplo |
|----------|--------|---------|
| Listar | `index.vue` | `/admin/clientes` |
| Criar | `novo.vue` | `/admin/clientes/novo` |
| Visualizar | `[id]/index.vue` | `/admin/clientes/123` |
| Editar | `[id]/editar.vue` | `/admin/clientes/123/editar` |

## CSS e Tailwind

### Classes Customizadas

```css
/* kebab-case para classes CSS */
.card-header { }
.btn-primary { }
.sidebar-link-active { }
```

### Variáveis CSS

```css
/* kebab-case com prefixo -- */
:root {
  --color-primary: #3b82f6;
  --sidebar-width: 280px;
  --header-height: 64px;
}
```

## Banco de Dados (Supabase)

### Tabelas

```sql
-- snake_case para tabelas (plural)
CREATE TABLE customers ( ... );
CREATE TABLE order_items ( ... );
CREATE TABLE product_categories ( ... );
```

### Colunas

```sql
-- snake_case para colunas
id UUID PRIMARY KEY,
created_at TIMESTAMP,
updated_at TIMESTAMP,
customer_id UUID REFERENCES customers(id),
total_amount DECIMAL
```

### Enums

```sql
-- snake_case para valores de enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);
```

## Commits Git

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (não afeta código) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Tarefas de manutenção |

### Exemplos

```
feat(clientes): adiciona formulário de cadastro

fix(vendas): corrige cálculo de desconto

docs(readme): atualiza instruções de instalação

refactor(composables): extrai lógica de paginação
```

## Resumo Rápido

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Componentes | PascalCase | `BaseButton.vue` |
| Composables | camelCase com `use` | `useAuth.ts` |
| Variáveis | camelCase | `isLoading` |
| Constantes | SCREAMING_SNAKE | `MAX_ITEMS` |
| Interfaces | PascalCase | `Customer` |
| Funções | camelCase | `fetchData` |
| CSS Classes | kebab-case | `btn-primary` |
| Tabelas DB | snake_case | `order_items` |
| Arquivos tipo | kebab ou index | `index.ts` |
