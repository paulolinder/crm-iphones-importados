# Template de Feature

Use este template ao implementar uma nova funcionalidade no sistema.

---

## Informações da Feature

### Nome
<!-- Nome descritivo da feature -->

### Módulo
<!-- Em qual módulo essa feature se encaixa (clientes, produtos, vendas, etc.) -->

### Objetivo
<!-- O que essa feature deve fazer? Qual problema resolve? -->

### Contexto
<!-- Informações de background necessárias para entender a feature -->

---

## Estrutura de Arquivos

### Páginas
```
app/pages/admin/{modulo}/
├── index.vue           # Listagem
├── novo.vue            # Criação
└── [id]/
    ├── index.vue       # Visualização
    └── editar.vue      # Edição
```

### Componentes
```
modules/{modulo}/components/
├── {Modulo}Card.vue
├── {Modulo}Form.vue
├── {Modulo}List.vue
├── {Modulo}Details.vue
└── {Modulo}Filters.vue
```

### Types
```typescript
// modules/{modulo}/types/index.ts

export interface {Entity} extends BaseEntity {
  // campos da entidade
}

export interface {Entity}FormData {
  // campos do formulário
}

export interface {Entity}Filters {
  // campos de filtro
}
```

### Service
```typescript
// modules/{modulo}/services/index.ts

export function use{Module}Service() {
  const { client } = useSupabase()
  
  const list = async (params: PaginationParams & Filters) => { }
  const getById = async (id: string) => { }
  const create = async (data: FormData) => { }
  const update = async (id: string, data: Partial<FormData>) => { }
  const remove = async (id: string) => { }
  
  return { list, getById, create, update, remove }
}
```

### Composable
```typescript
// modules/{modulo}/composables/use{Module}.ts

export function use{Module}() {
  const service = use{Module}Service()
  const crud = useCrudState<Entity>()
  const pagination = usePagination()
  const filters = useFilters<Filters>()
  
  const load = async () => { }
  const create = async (data: FormData) => { }
  const update = async (id: string, data: Partial<FormData>) => { }
  const remove = async (id: string) => { }
  
  return {
    ...crud,
    pagination,
    filters,
    load,
    create,
    update,
    remove,
  }
}
```

### Constants
```typescript
// modules/{modulo}/constants/index.ts

export const TABLE_COLUMNS = [ ]
export const STATUS_OPTIONS = [ ]
export const FILTER_OPTIONS = [ ]
```

### Validation (Zod)
```typescript
// modules/{modulo}/validation/index.ts

import { z } from 'zod'

export const {entity}Schema = z.object({
  // validações
})

export type {Entity}Input = z.infer<typeof {entity}Schema>
```

---

## Checklist de Implementação

### Preparação
- [ ] Tipos definidos em `modules/{modulo}/types/`
- [ ] Schema de validação criado (se necessário)
- [ ] Constantes definidas
- [ ] Tabela criada no Supabase (se nova)
- [ ] RLS configurada no Supabase

### Backend/Serviços
- [ ] Service implementado com todas operações CRUD
- [ ] Composable principal criado
- [ ] Tratamento de erros implementado

### UI/Frontend
- [ ] Página de listagem com tabela/cards
- [ ] Página de criação com formulário
- [ ] Página de visualização de detalhes
- [ ] Página de edição
- [ ] Estados de loading implementados
- [ ] Estados de erro implementados
- [ ] Estados vazios implementados
- [ ] Filtros funcionando
- [ ] Paginação funcionando
- [ ] Ações de tabela funcionando

### Qualidade
- [ ] Sem erros de TypeScript
- [ ] Código segue padrões de nomenclatura
- [ ] Componentes reutilizáveis quando apropriado
- [ ] UI responsiva
- [ ] Feedback visual para ações (toasts, confirmações)

### Documentação
- [ ] README atualizado se necessário
- [ ] Tipos documentados com JSDoc se complexos

---

## Exemplo de Uso

### Página de Listagem

```vue
<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { title, breadcrumbs, actions } = usePageMeta({
  title: 'Entidade',
  breadcrumbs: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Entidade' },
  ],
  actions: [
    {
      key: 'new',
      label: 'Nova Entidade',
      icon: 'lucide:plus',
      variant: 'primary',
      to: '/admin/entidade/novo',
    },
  ],
})

const { data, loading, filters, pagination, load } = useEntidade()

onMounted(() => {
  load()
})
</script>

<template>
  <AppContainer>
    <AppPageHeader :title="title" :breadcrumbs="breadcrumbs" :actions="actions" />
    
    <BaseCard :padding="false">
      <BaseFilterBar :filters="filterFields" v-model="filters" />
      
      <BaseTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :actions="tableActions"
      />
      
      <BasePagination v-bind="pagination" />
    </BaseCard>
  </AppContainer>
</template>
```

---

## Notas Adicionais

<!-- Qualquer informação adicional relevante para a implementação -->
