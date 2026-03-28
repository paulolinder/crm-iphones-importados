# Regras do Projeto para IA

## Instruções Obrigatórias

Este documento contém regras que DEVEM ser seguidas por qualquer IA que interaja com este projeto.

---

## 1. Padrões do Nuxt 4

- ✅ Usar o diretório `app/` como srcDir (convenção Nuxt 4)
- ✅ Usar auto-imports do Nuxt para composables e componentes
- ✅ Usar `definePageMeta` para metadados de página
- ✅ Usar `useHead` para meta tags
- ✅ Usar `navigateTo` para navegação programática
- ✅ Usar `$fetch` ou composables para chamadas de API
- ❌ NÃO usar Options API (sempre Composition API com `<script setup>`)
- ❌ NÃO importar componentes manualmente (auto-import)

## 2. Componentização

- ✅ SEMPRE quebrar interfaces em componentes reutilizáveis
- ✅ Componentes devem ter no máximo ~100 linhas de template
- ✅ Usar componentes base (`Base*`) para primitivos de UI
- ✅ Criar componentes de módulo quando específicos do domínio
- ❌ NÃO duplicar código de UI - extrair para componente
- ❌ NÃO criar componentes com mais de 200 linhas

## 3. Tipagem TypeScript

- ✅ SEMPRE tipar props com interface
- ✅ SEMPRE tipar emits com generics
- ✅ SEMPRE tipar retorno de composables
- ✅ Usar tipos do módulo `/types` ou `/modules/*/types`
- ❌ NUNCA usar `any`
- ❌ NUNCA ignorar erros de tipo com `@ts-ignore`

## 4. Organização de Arquivos

- ✅ Componentes em `/app/components/{categoria}/`
- ✅ Composables em `/app/composables/`
- ✅ Tipos globais em `/types/`
- ✅ Tipos de módulo em `/modules/{modulo}/types/`
- ✅ Serviços em `/modules/{modulo}/services/`
- ❌ NÃO criar arquivos fora da estrutura definida
- ❌ NÃO criar arquivos gigantes - dividir por responsabilidade

## 5. Separação de Responsabilidades

```
Pages       → Composição, layout, routing
Composables → Lógica reutilizável, estado
Services    → Acesso a dados, transformações
Components  → UI pura, apresentação
Types       → Definições de tipo
Constants   → Valores estáticos
```

- ❌ NÃO colocar lógica de negócio em componentes de UI
- ❌ NÃO acessar Supabase diretamente em componentes
- ❌ NÃO misturar concerns diferentes no mesmo arquivo

## 6. Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes base | `Base{Nome}` | `BaseButton` |
| Componentes layout | `App{Nome}` | `AppSidebar` |
| Composables | `use{Nome}` | `useAuth` |
| Types | `PascalCase` | `Customer` |
| Constantes | `SCREAMING_SNAKE` | `MAX_ITEMS` |
| Variáveis | `camelCase` | `isLoading` |
| Funções | `camelCase` | `fetchData` |

## 7. Estilização

- ✅ Usar Tailwind CSS
- ✅ Usar classes definidas em `main.css` quando apropriado
- ✅ Usar design tokens do `app.config.ts`
- ❌ NÃO criar CSS inline extenso
- ❌ NÃO usar `!important`
- ❌ NÃO criar novas cores fora da paleta definida

## 8. Supabase

- ✅ Usar composable `useSupabase` ou `useSupabaseDB`
- ✅ Tipar queries com tipos gerados
- ✅ Tratar erros de todas as queries
- ✅ Usar services para operações complexas
- ❌ NÃO expor service key no cliente
- ❌ NÃO fazer queries sem tratamento de erro

## 9. Componentes - Estrutura

```vue
<script setup lang="ts">
// 1. Imports de tipos
// 2. Interface Props
// 3. defineProps com defaults
// 4. defineEmits tipados
// 5. Composables
// 6. Estado local (ref, reactive)
// 7. Computed
// 8. Métodos
// 9. Lifecycle hooks
</script>

<template>
  <!-- Template limpo e organizado -->
</template>

<style scoped>
/* Apenas quando necessário */
</style>
```

## 10. Documentação

- ✅ Adicionar JSDoc em composables e funções complexas
- ✅ Atualizar docs se criar nova estrutura relevante
- ✅ Manter README atualizado com mudanças significativas
- ❌ NÃO adicionar comentários óbvios
- ❌ NÃO deixar código comentado

## 11. Ao Criar Novas Features

1. Verificar se já existe componente/composable reutilizável
2. Criar tipos primeiro
3. Criar service se necessário
4. Criar composable para lógica
5. Criar componentes necessários
6. Criar página
7. Testar funcionalidade
8. Atualizar documentação se relevante

## 12. Checklist de PR/Commit

- [ ] Código segue padrões de nomenclatura
- [ ] Tipos definidos corretamente
- [ ] Sem erros de TypeScript
- [ ] Componentes reutilizáveis quando apropriado
- [ ] Sem duplicação de código
- [ ] Tratamento de erros implementado
- [ ] UI responsiva
- [ ] Estados de loading/error/empty tratados

---

## Referências

- [Arquitetura](../docs/architecture.md)
- [Guia de Componentes](../docs/component-guidelines.md)
- [Convenções de Nomenclatura](../docs/naming-conventions.md)
- [Integração Supabase](../docs/supabase-guidelines.md)
- [Sistema de UI](../docs/ui-system.md)
