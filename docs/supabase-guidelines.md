# Guia de Integração Supabase

## Visão Geral

O Supabase é utilizado como backend do sistema, fornecendo:
- Banco de dados PostgreSQL
- Autenticação
- Storage (para imagens e arquivos)
- Realtime (quando necessário)

## Configuração

### Variáveis de Ambiente

```env
# .env
SUPABASE_URL=https://migxevookiubncmcsgvy.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
```

### Estrutura de Arquivos

```
lib/
└── supabase/
    ├── client.ts      # Cliente para uso no browser
    ├── server.ts      # Cliente para uso no servidor
    ├── types.ts       # Tipos gerados do banco
    └── index.ts       # Exports
```

## Uso do Cliente

### No Browser (Composables)

```typescript
// Usando o composable
const { client, user, signIn, signOut } = useSupabase()

// Ou para operações de banco
const { data, loading, fetchAll, create, update, remove } = useSupabaseDB('customers')
```

### No Servidor (API Routes)

```typescript
// server/api/customers.get.ts
import { getSupabaseServerClient } from '~/lib/supabase/server'

export default defineEventHandler(async (event) => {
  const client = getSupabaseServerClient(event)
  
  const { data, error } = await client
    .from('customers')
    .select('*')
    
  if (error) throw createError({ statusCode: 500, message: error.message })
  
  return data
})
```

## Padrões de Query

### Select Básico

```typescript
const { data, error } = await client
  .from('customers')
  .select('*')
  .eq('active', true)
  .order('created_at', { ascending: false })
  .limit(10)
```

### Select com Relações

```typescript
const { data, error } = await client
  .from('orders')
  .select(`
    *,
    customer:customers(id, name, email),
    items:order_items(
      *,
      product:products(id, name, sku)
    )
  `)
  .eq('id', orderId)
  .single()
```

### Insert

```typescript
const { data, error } = await client
  .from('customers')
  .insert({
    name: 'João Silva',
    email: 'joao@email.com',
  })
  .select()
  .single()
```

### Update

```typescript
const { data, error } = await client
  .from('customers')
  .update({ name: 'João Santos' })
  .eq('id', customerId)
  .select()
  .single()
```

### Delete

```typescript
const { error } = await client
  .from('customers')
  .delete()
  .eq('id', customerId)
```

### Upsert

```typescript
const { data, error } = await client
  .from('settings')
  .upsert({
    key: 'theme',
    value: 'dark',
  })
  .select()
  .single()
```

## Paginação

```typescript
const page = 1
const perPage = 10
const offset = (page - 1) * perPage

const { data, count, error } = await client
  .from('customers')
  .select('*', { count: 'exact' })
  .range(offset, offset + perPage - 1)
  .order('created_at', { ascending: false })
```

## Filtros

```typescript
// Igualdade
.eq('status', 'active')

// Diferente
.neq('status', 'cancelled')

// Maior/Menor
.gt('price', 100)
.gte('price', 100)
.lt('price', 1000)
.lte('price', 1000)

// Like (case insensitive)
.ilike('name', '%joão%')

// In
.in('status', ['pending', 'confirmed'])

// Is null
.is('deleted_at', null)

// Range de datas
.gte('created_at', '2024-01-01')
.lte('created_at', '2024-12-31')

// Múltiplos filtros (AND)
.eq('status', 'active')
.gte('price', 100)
.lte('price', 1000)

// OR
.or('status.eq.pending,status.eq.confirmed')
```

## Tipagem

### Gerando Tipos

Execute para atualizar os tipos do banco:

```bash
npx supabase gen types typescript --project-id migxevookiubncmcsgvy > lib/supabase/types.ts
```

### Usando Tipos

```typescript
import type { Database, Tables, InsertTables, UpdateTables } from '~/lib/supabase/types'

// Tipo de uma row
type Customer = Tables<'customers'>

// Tipo para insert
type NewCustomer = InsertTables<'customers'>

// Tipo para update
type UpdateCustomer = UpdateTables<'customers'>
```

## Autenticação

### Login

```typescript
const { signIn } = useSupabase()

try {
  await signIn(email, password)
  // Redireciona após login
} catch (error) {
  // Trata erro
}
```

### Logout

```typescript
const { signOut } = useSupabase()

await signOut()
```

### Usuário Atual

```typescript
const { user, isAuthenticated } = useAuth()

// Em templates
<div v-if="isAuthenticated">
  Olá, {{ user?.email }}
</div>
```

### Middleware de Autenticação

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isInitialized } = useAuth()
  
  if (isInitialized.value && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

## Row Level Security (RLS)

Sempre use RLS para proteger dados sensíveis:

```sql
-- Exemplo: Usuários só veem seus próprios dados
CREATE POLICY "Users can view own data" ON customers
  FOR SELECT USING (auth.uid() = user_id);

-- Exemplo: Admins podem ver tudo
CREATE POLICY "Admins can view all" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

## Storage

### Upload de Arquivo

```typescript
const { client } = useSupabase()

const file = event.target.files[0]
const fileName = `${Date.now()}-${file.name}`

const { data, error } = await client.storage
  .from('products')
  .upload(fileName, file)

if (error) throw error

// URL pública
const { data: { publicUrl } } = client.storage
  .from('products')
  .getPublicUrl(fileName)
```

### Download de Arquivo

```typescript
const { data, error } = await client.storage
  .from('products')
  .download('path/to/file.jpg')
```

## Boas Práticas

1. **Sempre tratar erros** - Queries Supabase podem falhar
2. **Usar tipos** - Manter tipos sincronizados com o banco
3. **RLS** - Proteger dados com Row Level Security
4. **Paginação** - Não buscar todos os registros de uma vez
5. **Select específico** - Buscar apenas colunas necessárias
6. **Transações** - Usar RPC para operações complexas
7. **Índices** - Criar índices para colunas filtradas frequentemente

## Tratamento de Erros

```typescript
const { data, error } = await client
  .from('customers')
  .select('*')

if (error) {
  // Log para debugging
  console.error('Supabase error:', error)
  
  // Erro amigável para o usuário
  throw new Error('Não foi possível carregar os clientes')
}

return data
```

## Realtime (quando necessário)

```typescript
// Inscrever em mudanças
const channel = client
  .channel('orders')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// Cancelar inscrição
onUnmounted(() => {
  channel.unsubscribe()
})
```
