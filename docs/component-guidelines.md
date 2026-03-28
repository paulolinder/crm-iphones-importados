# Guia de Componentes

## Princípios Fundamentais

1. **Pequenos e Focados** - Cada componente deve fazer uma coisa bem
2. **Reutilizáveis** - Projetados para serem usados em múltiplos contextos
3. **Previsíveis** - Comportamento consistente e documentado
4. **Composáveis** - Fáceis de combinar com outros componentes

## Hierarquia de Componentes

### Base Components (`components/base/`)

Componentes primitivos de UI que formam a fundação do design system.

**Características:**
- Sem lógica de negócio
- Props bem definidas com valores padrão
- Slots para customização
- Emitem eventos padronizados
- Documentação inline

**Exemplos:**
- `BaseButton` - Botão com variantes e estados
- `BaseInput` - Input com label, erro e ícones
- `BaseCard` - Container com header, body e footer
- `BaseModal` - Modal com backdrop e animações
- `BaseTable` - Tabela com sort, selection e actions

### Layout Components (`components/layout/`)

Componentes estruturais específicos do layout administrativo.

**Características:**
- Definem a estrutura visual da página
- Podem usar composables globais
- Raramente precisam de props complexas

**Exemplos:**
- `AppSidebar` - Menu lateral
- `AppHeader` - Cabeçalho com busca e ações
- `AppPageHeader` - Título de página com breadcrumbs
- `AppContainer` - Container de conteúdo

### Shared Components (`components/shared/`)

Componentes compartilhados entre módulos.

**Características:**
- Podem ter lógica de apresentação
- Reutilizados em múltiplos módulos
- Podem importar composables

**Exemplos:**
- `LoadingState` - Estado de carregamento
- `ErrorState` - Estado de erro
- `StatusBadge` - Badge de status configurável
- `SearchInput` - Input de busca com debounce

### Module Components (`modules/*/components/`)

Componentes específicos de um módulo de negócio.

**Características:**
- Podem ter lógica de negócio
- Específicos do contexto do módulo
- Podem importar services e types do módulo

**Exemplos:**
- `CustomerCard` - Card de cliente
- `ProductForm` - Formulário de produto
- `OrderTimeline` - Timeline de pedido

## Estrutura de um Componente

```vue
<script setup lang="ts">
/**
 * ComponentName
 *
 * Breve descrição do propósito do componente.
 */

// 1. Imports de tipos
import type { PropType } from '~/types'

// 2. Interface de Props
interface Props {
  title: string
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

// 3. Define props com defaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
})

// 4. Define emits tipados
const emit = defineEmits<{
  click: []
  change: [value: string]
}>()

// 5. Composables e dependências
const { format } = useCurrency()

// 6. Estado local
const isOpen = ref(false)

// 7. Computed properties
const classes = computed(() => ({
  'is-primary': props.variant === 'primary',
}))

// 8. Métodos
const handleClick = () => {
  emit('click')
}

// 9. Lifecycle hooks
onMounted(() => {
  // ...
})
</script>

<template>
  <div :class="classes">
    <!-- Conteúdo -->
  </div>
</template>

<style scoped>
/* Estilos scoped quando necessário */
</style>
```

## Boas Práticas

### Props

```typescript
// ✅ BOM: Props tipadas com interface
interface Props {
  value: string
  disabled?: boolean
}

// ❌ RUIM: Props sem tipagem
defineProps(['value', 'disabled'])
```

### Emits

```typescript
// ✅ BOM: Emits tipados
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [data: FormData]
}>()

// ❌ RUIM: Emits sem tipagem
const emit = defineEmits(['update:modelValue', 'submit'])
```

### Slots

```vue
<!-- ✅ BOM: Slots nomeados com fallback -->
<slot name="header">
  <h3>{{ title }}</h3>
</slot>

<!-- ✅ BOM: Slot com scoped props -->
<slot name="item" :item="item" :index="index" />
```

### Classes Condicionais

```vue
<!-- ✅ BOM: Object syntax para múltiplas classes -->
<div :class="{
  'is-active': isActive,
  'is-disabled': disabled,
  'is-loading': loading,
}" />

<!-- ✅ BOM: Array syntax quando necessário -->
<div :class="[
  baseClass,
  variantClass,
  { 'is-active': isActive },
]" />
```

## Quando Criar um Novo Componente

Crie um novo componente quando:

1. **Repetição** - O mesmo código aparece em 2+ lugares
2. **Complexidade** - Uma seção tem lógica própria significativa
3. **Testabilidade** - Facilita testar uma funcionalidade isolada
4. **Legibilidade** - Melhora a leitura do componente pai

## Quando NÃO Criar um Novo Componente

Evite criar componentes quando:

1. **Muito simples** - Apenas 1-2 elementos HTML
2. **Uso único** - Só será usado em um lugar
3. **Abstração prematura** - Não há padrão claro ainda

## Tamanho Ideal

- **< 100 linhas** de template - ideal
- **100-200 linhas** - aceitável, considere dividir
- **> 200 linhas** - provavelmente deve ser dividido

## Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Base | `Base{Nome}` | `BaseButton`, `BaseInput` |
| Layout | `App{Nome}` | `AppSidebar`, `AppHeader` |
| Shared | `{Nome}` | `LoadingState`, `StatusBadge` |
| Module | `{Modulo}{Nome}` | `CustomerCard`, `ProductForm` |

## Checklist de Componente

- [ ] Props tipadas com interface
- [ ] Valores padrão definidos
- [ ] Emits tipados
- [ ] Documentação inline (JSDoc)
- [ ] Slots com fallback quando apropriado
- [ ] Acessibilidade básica (aria, roles)
- [ ] Responsivo quando aplicável
- [ ] Estados de loading/error quando aplicável
