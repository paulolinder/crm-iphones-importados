# Instruções para IA - Eleve Imports CRM

## Visão Geral do Projeto

Este é um sistema CRM para loja de iPhones e produtos importados, desenvolvido com:

- **Nuxt 4** - Framework Vue full-stack
- **Vue 3** - Composition API com `<script setup>`
- **TypeScript** - Tipagem estática obrigatória
- **Tailwind CSS** - Utilitários CSS
- **Supabase** - Backend (DB, Auth, Storage)
- **Pinia** - State management

## Antes de Fazer Qualquer Alteração

1. **Leia a documentação relevante:**
   - [Arquitetura](../docs/architecture.md)
   - [Guia de Componentes](../docs/component-guidelines.md)
   - [Convenções de Nomenclatura](../docs/naming-conventions.md)
   - [Integração Supabase](../docs/supabase-guidelines.md)
   - [Sistema de UI](../docs/ui-system.md)

2. **Leia as regras obrigatórias:**
   - [Regras do Projeto](./project-rules.md)

3. **Verifique componentes existentes:**
   - Base components em `app/components/base/`
   - Shared components em `app/components/shared/`
   - Composables em `app/composables/`

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Verificar tipos
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Gerar tipos do Supabase
npx supabase gen types typescript --project-id migxevookiubncmcsgvy > lib/supabase/types.ts
```

## Estrutura do Projeto

```
eleve-imports-crm/
├── app/                      # Código fonte (Nuxt 4)
│   ├── components/          # Componentes Vue
│   │   ├── base/           # Primitivos UI
│   │   ├── layout/         # Estrutura visual
│   │   └── shared/         # Compartilhados
│   ├── composables/         # Lógica reutilizável
│   ├── layouts/             # Layouts Nuxt
│   ├── pages/               # Páginas/Rotas
│   └── ...
├── lib/supabase/            # Cliente Supabase
├── modules/                  # Módulos por domínio
│   ├── clientes/
│   ├── produtos/
│   ├── vendas/
│   └── ...
├── types/                    # Tipos globais
├── docs/                     # Documentação
└── .ai/                      # Instruções para IA
```

## Ao Criar Novas Features

Use o template: [Feature Template](./feature-template.md)

### Fluxo Recomendado

1. **Definir tipos** em `modules/{modulo}/types/`
2. **Criar service** em `modules/{modulo}/services/`
3. **Criar composable** em `modules/{modulo}/composables/`
4. **Criar componentes** necessários
5. **Criar páginas**
6. **Testar**
7. **Documentar** se relevante

## Ao Criar Novos Componentes

Use o template: [Component Template](./component-template.md)

### Hierarquia

1. **Base** (`Base*`) - Primitivos sem lógica de negócio
2. **Layout** (`App*`) - Estrutura do admin
3. **Shared** - Reutilizáveis entre módulos
4. **Module** - Específicos do domínio

### Verificar Antes de Criar

- Já existe componente base que pode ser usado?
- Já existe componente similar que pode ser estendido?
- Esse componente será reutilizado?

## Regras Críticas

### SEMPRE

- ✅ Usar TypeScript com tipos explícitos
- ✅ Seguir convenções de nomenclatura
- ✅ Componentizar interfaces repetidas
- ✅ Tratar erros de queries
- ✅ Implementar estados de loading/error/empty
- ✅ Usar composables existentes
- ✅ Manter consistência visual

### NUNCA

- ❌ Usar `any`
- ❌ Criar arquivos fora da estrutura
- ❌ Duplicar código
- ❌ Criar componentes gigantes (+200 linhas)
- ❌ Misturar lógica de negócio com UI
- ❌ Ignorar erros de TypeScript
- ❌ Criar estilos fora do design system

## Padrões de Código

### Página Típica

```vue
<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { title, breadcrumbs, actions } = usePageMeta({
  title: 'Título',
  breadcrumbs: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Título' },
  ],
  actions: [
    { key: 'new', label: 'Novo', variant: 'primary', to: '/...' },
  ],
})

const { data, loading, load } = useModule()

onMounted(() => load())
</script>

<template>
  <AppContainer>
    <AppPageHeader :title :breadcrumbs :actions />
    <!-- Content -->
  </AppContainer>
</template>
```

### Composable Típico

```typescript
export function useExample() {
  const service = useExampleService()
  const crud = useCrudState<Example>()
  
  const load = async () => {
    crud.setLoading(true)
    try {
      const data = await service.list()
      crud.setData(data)
    } catch (e) {
      crud.setError(e as Error)
    }
  }
  
  return { ...crud, load }
}
```

## Supabase

- **Client-side**: Use `useSupabase()` ou `useSupabaseDB()`
- **Server-side**: Use `getSupabaseServerClient()`
- **Sempre** tipar queries com tipos gerados
- **Sempre** tratar erros

## Dúvidas Frequentes

### Onde colocar um novo componente?

- UI primitivo reutilizável → `components/base/`
- Estrutura do layout → `components/layout/`
- Usado em múltiplos módulos → `components/shared/`
- Específico de um módulo → `modules/{modulo}/components/`

### Onde colocar um novo tipo?

- Usado globalmente → `types/global/`
- Específico de módulo → `modules/{modulo}/types/`

### Onde colocar lógica de acesso a dados?

- Service em `modules/{modulo}/services/`
- Composable que usa o service em `modules/{modulo}/composables/`

### Como adicionar uma nova página?

1. Criar arquivo em `app/pages/admin/{modulo}/`
2. Usar layout admin: `definePageMeta({ layout: 'admin' })`
3. Usar `usePageMeta` para título e breadcrumbs
4. Seguir padrões de página existentes

---

**Lembre-se:** Consistência é mais importante que perfeição. Siga os padrões existentes.
