# Template de Componente

Use este template como referência ao criar novos componentes.

---

## Estrutura Padrão

```vue
<script setup lang="ts">
/**
 * ComponentName
 *
 * Breve descrição do propósito do componente.
 * 
 * @example
 * <ComponentName
 *   title="Título"
 *   :loading="isLoading"
 *   @click="handleClick"
 * />
 */

// ============================================
// 1. IMPORTS DE TIPOS
// ============================================
import type { SomeType } from '~/types'

// ============================================
// 2. INTERFACE DE PROPS
// ============================================
interface Props {
  /** Título exibido no componente */
  title: string
  
  /** Descrição opcional */
  description?: string
  
  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'danger'
  
  /** Estado de carregamento */
  loading?: boolean
  
  /** Desabilitar interações */
  disabled?: boolean
}

// ============================================
// 3. DEFINE PROPS COM DEFAULTS
// ============================================
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
})

// ============================================
// 4. DEFINE EMITS TIPADOS
// ============================================
const emit = defineEmits<{
  /** Emitido ao clicar no componente */
  click: []
  
  /** Emitido ao mudar valor */
  change: [value: string]
  
  /** Emitido ao submeter */
  submit: [data: FormData]
}>()

// ============================================
// 5. COMPOSABLES E DEPENDÊNCIAS
// ============================================
const { format } = useCurrency()
const { t } = useI18n()

// ============================================
// 6. ESTADO LOCAL
// ============================================
const isOpen = ref(false)
const internalValue = ref('')

// ============================================
// 7. COMPUTED PROPERTIES
// ============================================
const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => ({
  'component-base': true,
  [`component-${props.variant}`]: true,
  'is-loading': props.loading,
  'is-disabled': isDisabled.value,
}))

// ============================================
// 8. MÉTODOS
// ============================================
const handleClick = () => {
  if (isDisabled.value) return
  emit('click')
}

const handleChange = (value: string) => {
  internalValue.value = value
  emit('change', value)
}

// ============================================
// 9. LIFECYCLE HOOKS
// ============================================
onMounted(() => {
  // Inicialização
})

onUnmounted(() => {
  // Limpeza
})

// ============================================
// 10. EXPOSE (se necessário)
// ============================================
defineExpose({
  reset: () => {
    internalValue.value = ''
  },
})
</script>

<template>
  <div :class="classes" @click="handleClick">
    <!-- Header -->
    <div v-if="title || $slots.header" class="component-header">
      <slot name="header">
        <h3 class="component-title">{{ title }}</h3>
        <p v-if="description" class="component-description">
          {{ description }}
        </p>
      </slot>
    </div>

    <!-- Content -->
    <div class="component-content">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="component-footer">
      <slot name="footer" />
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="component-loading">
      <LoadingState />
    </div>
  </div>
</template>

<style scoped>
/* Estilos scoped apenas quando necessário */
.component-base {
  /* ... */
}
</style>
```

---

## Checklist do Componente

### Antes de Criar

- [ ] Verificar se já existe componente similar
- [ ] Definir se é base, layout, shared ou module component
- [ ] Identificar props necessárias
- [ ] Identificar eventos a serem emitidos
- [ ] Identificar slots necessários

### Implementação

- [ ] Props tipadas com interface
- [ ] Valores padrão para props opcionais
- [ ] Emits tipados com generics
- [ ] JSDoc no início do script
- [ ] Código organizado nas seções corretas

### Qualidade

- [ ] Sem erros de TypeScript
- [ ] Acessibilidade básica (aria, roles quando aplicável)
- [ ] Responsivo se necessário
- [ ] Estados de loading/disabled tratados
- [ ] Slots com fallback quando apropriado

### Nomenclatura

| Tipo | Prefixo | Exemplo |
|------|---------|---------|
| Base | `Base` | `BaseButton`, `BaseInput` |
| Layout | `App` | `AppSidebar`, `AppHeader` |
| Shared | - | `LoadingState`, `StatusBadge` |
| Module | `{Module}` | `CustomerCard`, `ProductForm` |

---

## Exemplos por Tipo

### Componente Base

```vue
<script setup lang="ts">
/**
 * BaseExample
 * 
 * Componente base reutilizável para...
 */

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})
</script>

<template>
  <div class="base-example">
    <slot />
  </div>
</template>
```

### Componente de Módulo

```vue
<script setup lang="ts">
/**
 * CustomerCard
 * 
 * Card de exibição de informações do cliente.
 */

import type { Customer } from '~/modules/clientes/types'

interface Props {
  customer: Customer
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
})

const emit = defineEmits<{
  click: [customer: Customer]
}>()

const { format } = useCurrency()
</script>

<template>
  <BaseCard 
    :hover="clickable" 
    :clickable="clickable"
    @click="emit('click', customer)"
  >
    <div class="flex items-center gap-4">
      <BaseAvatar :name="customer.name" size="lg" />
      <div>
        <h4 class="font-semibold">{{ customer.name }}</h4>
        <p class="text-sm text-slate-500">{{ customer.email }}</p>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-between text-sm">
        <span>{{ customer.total_orders }} pedidos</span>
        <span class="font-medium">{{ format(customer.total_spent) }}</span>
      </div>
    </template>
  </BaseCard>
</template>
```

---

## Padrões de Slots

### Slot Simples

```vue
<template>
  <slot />
</template>
```

### Slot com Fallback

```vue
<template>
  <slot name="header">
    <h3>{{ title }}</h3>
  </slot>
</template>
```

### Scoped Slot

```vue
<template>
  <slot name="item" :item="item" :index="index" :selected="isSelected" />
</template>
```

---

## Padrões de Eventos

### Evento Simples

```typescript
const emit = defineEmits<{
  click: []
}>()

// Uso
emit('click')
```

### Evento com Payload

```typescript
const emit = defineEmits<{
  change: [value: string]
  submit: [data: { name: string; email: string }]
}>()

// Uso
emit('change', 'novo valor')
emit('submit', { name: 'João', email: 'joao@email.com' })
```

### v-model

```typescript
interface Props {
  modelValue: string
}

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Uso no template
<input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
```
