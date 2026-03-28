# Arquitetura do Sistema

## Visão Geral

O Eleve Imports CRM é um sistema de gestão para loja de iPhones e produtos importados, desenvolvido com foco em escalabilidade, manutenibilidade e experiência do usuário.

## Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Nuxt | 4.x | Framework full-stack Vue |
| Vue | 3.5+ | Framework reativo de UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.4+ | Utilitários CSS |
| Supabase | 2.x | Backend-as-a-Service (DB, Auth, Storage) |
| Pinia | 2.x | Gerenciamento de estado |
| VueUse | 11.x | Composables utilitários |

## Estrutura de Diretórios

```
eleve-imports-crm/
├── app/                      # Código fonte da aplicação (Nuxt 4)
│   ├── assets/              # Assets estáticos (CSS, imagens)
│   │   └── css/
│   │       └── main.css     # Estilos globais e Tailwind
│   ├── components/          # Componentes Vue
│   │   ├── base/           # Componentes base reutilizáveis
│   │   ├── layout/         # Componentes de layout
│   │   ├── shared/         # Componentes compartilhados
│   │   └── ui/             # Componentes de UI específicos
│   ├── composables/         # Composables Vue
│   ├── layouts/             # Layouts Nuxt
│   ├── middleware/          # Middleware de rotas
│   ├── pages/               # Páginas/Rotas
│   │   └── admin/          # Páginas do painel administrativo
│   ├── plugins/             # Plugins Nuxt
│   ├── stores/              # Stores Pinia
│   └── utils/               # Utilitários
├── lib/                      # Bibliotecas e helpers
│   ├── supabase/            # Cliente e tipos Supabase
│   ├── helpers/             # Funções auxiliares
│   └── constants/           # Constantes globais
├── modules/                  # Módulos do sistema (por domínio)
│   ├── clientes/
│   ├── produtos/
│   ├── vendas/
│   ├── estoque/
│   └── ...
├── server/                   # API e lógica server-side
│   ├── api/
│   └── utils/
├── types/                    # Definições de tipos TypeScript
│   ├── global/
│   └── modules/
├── docs/                     # Documentação
├── .ai/                      # Instruções para IA
└── public/                   # Assets públicos
```

## Padrões Arquiteturais

### 1. Arquitetura por Domínio

O sistema é organizado por domínios de negócio (módulos), onde cada módulo contém:

- `types/` - Tipos e interfaces do domínio
- `services/` - Serviços de acesso a dados
- `composables/` - Composables específicos do módulo
- `constants/` - Constantes do módulo
- `validation/` - Schemas de validação (Zod)

### 2. Separação de Responsabilidades

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGES                                 │
│  (Composição de componentes, lógica de página, routing)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      COMPOSABLES                             │
│  (Lógica reutilizável, estado reativo, orquestração)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                               │
│  (Acesso a dados, chamadas API, transformações)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SUPABASE                               │
│  (Banco de dados, autenticação, storage)                    │
└─────────────────────────────────────────────────────────────┘
```

### 3. Componentização

Os componentes são organizados em camadas:

1. **Base Components** (`components/base/`)
   - Primitivos UI (Button, Input, Card, Modal)
   - Altamente reutilizáveis
   - Sem lógica de negócio

2. **Layout Components** (`components/layout/`)
   - Estrutura visual (Sidebar, Header, Container)
   - Específicos do layout admin

3. **Shared Components** (`components/shared/`)
   - Componentes compartilhados entre módulos
   - Podem ter lógica de apresentação

4. **Module Components** (`modules/*/components/`)
   - Específicos de um módulo
   - Podem ter lógica de negócio

## Fluxo de Dados

### Leitura de Dados

```
Page → Composable → Service → Supabase
         ↓
    State (reactive)
         ↓
    Component (render)
```

### Escrita de Dados

```
Component (event)
         ↓
    Composable (handler)
         ↓
    Service (mutation)
         ↓
    Supabase (persist)
         ↓
    State update (reactive)
```

## Convenções de Código

### Estrutura de Composables

```typescript
export function useExample() {
  // 1. Imports e dependências
  const { client } = useSupabase()
  
  // 2. Estado reativo
  const data = ref<Type[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  // 3. Computed properties
  const isEmpty = computed(() => data.value.length === 0)
  
  // 4. Métodos
  const load = async () => { /* ... */ }
  const create = async (item: Type) => { /* ... */ }
  
  // 5. Lifecycle hooks
  onMounted(() => { /* ... */ })
  
  // 6. Return
  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    isEmpty,
    load,
    create,
  }
}
```

### Estrutura de Services

```typescript
export function useExampleService() {
  const { client } = useSupabase()
  
  const list = async (params: Params): Promise<Response> => {
    const { data, error } = await client
      .from('table')
      .select('*')
      
    if (error) throw error
    return data
  }
  
  return { list }
}
```

## Autenticação e Autorização

- Autenticação via Supabase Auth
- Sessões gerenciadas automaticamente
- Middleware de proteção de rotas
- Row Level Security (RLS) no banco

## Considerações de Performance

1. **Code Splitting** - Nuxt divide automaticamente por rota
2. **Lazy Loading** - Componentes carregados sob demanda
3. **Caching** - Utilizar cache de queries quando apropriado
4. **Otimização de Imagens** - Usar @nuxt/image
5. **Debounce** - Em buscas e filtros

## Próximos Passos Recomendados

1. Definir schema completo do banco de dados
2. Gerar tipos TypeScript do Supabase
3. Implementar autenticação completa
4. Implementar primeiro módulo CRUD completo (ex: Clientes)
5. Criar testes unitários e de integração
