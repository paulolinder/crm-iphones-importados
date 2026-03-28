# Sistema de UI

## Conceito Visual

O sistema foi projetado com foco em:

- **Clareza** - Informações fáceis de encontrar e entender
- **Profissionalismo** - Visual sóbrio e confiável
- **Modernidade** - Design contemporâneo e elegante
- **Organização** - Hierarquia visual clara

## Estrutura de Layout

### Layout Admin

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER (64px)                         │
│  [Search] ───────────────────────────── [Notifications][User]│
├─────────────┬───────────────────────────────────────────────┤
│             │                                                │
│   SIDEBAR   │                  CONTENT                       │
│   (280px)   │                                                │
│             │   ┌─────────────────────────────────────┐     │
│   [Logo]    │   │  Page Header                         │     │
│             │   │  [Título] ─────────── [Ações]       │     │
│   [Menu]    │   └─────────────────────────────────────┘     │
│   Dashboard │                                                │
│   Clientes  │   ┌─────────────────────────────────────┐     │
│   Produtos  │   │  Cards / Stats                       │     │
│   Estoque   │   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │     │
│   Vendas    │   │  │    │ │    │ │    │ │    │       │     │
│   ...       │   │  └────┘ └────┘ └────┘ └────┘       │     │
│             │   └─────────────────────────────────────┘     │
│             │                                                │
│             │   ┌─────────────────────────────────────┐     │
│   [Toggle]  │   │  Content Cards / Tables              │     │
│             │   │                                       │     │
│             │   │                                       │     │
│             │   └─────────────────────────────────────┘     │
│             │                                                │
└─────────────┴───────────────────────────────────────────────┘
```

### Containers

- **AppContainer** - Container principal com max-width e padding
- **BaseCard** - Container para conteúdo com sombra e bordas arredondadas
- **AppCardGrid** - Grid responsivo para cards

## Hierarquia Visual

### Tipografia

| Elemento | Classe | Uso |
|----------|--------|-----|
| Page Title | `text-2xl font-bold` | Título principal da página |
| Section Title | `text-lg font-semibold` | Títulos de seções |
| Card Title | `text-base font-semibold` | Títulos de cards |
| Body | `text-sm` | Texto de conteúdo |
| Small/Caption | `text-xs` | Textos secundários |

### Cores

#### Paleta Principal

| Nome | Valor | Uso |
|------|-------|-----|
| Primary | `#2563eb` (blue-600) | Ações principais, links, destaques |
| Secondary | `#64748b` (slate-500) | Textos secundários, bordas |
| Success | `#16a34a` (green-600) | Confirmações, status positivo |
| Warning | `#eab308` (yellow-500) | Alertas, atenção |
| Danger | `#ef4444` (red-500) | Erros, ações destrutivas |
| Info | `#0ea5e9` (sky-500) | Informações neutras |

#### Backgrounds

| Nome | Valor | Uso |
|------|-------|-----|
| Page | `#f8fafc` (slate-50) | Fundo da página |
| Card | `#ffffff` (white) | Fundo de cards |
| Sidebar | `#0f172a` (slate-900) | Fundo do sidebar |
| Header | `#ffffff` (white) | Fundo do header |

#### Textos

| Nome | Valor | Uso |
|------|-------|-----|
| Primary | `#0f172a` (slate-900) | Títulos, textos importantes |
| Secondary | `#64748b` (slate-500) | Descrições, textos auxiliares |
| Muted | `#94a3b8` (slate-400) | Placeholders, textos desabilitados |

## Espaçamentos

### Sistema de Grid

| Token | Valor | Uso |
|-------|-------|-----|
| `gap-4` | 16px | Entre cards em grid |
| `gap-6` | 24px | Entre seções |
| `p-4` | 16px | Padding interno de filtros |
| `p-5` | 20px | Padding interno de cards |
| `p-6` | 24px | Padding de página |

### Margens

| Token | Valor | Uso |
|-------|-------|-----|
| `mb-4` | 16px | Entre elementos relacionados |
| `mb-6` | 24px | Entre seções |
| `mt-1` | 4px | Entre label e input |

## Componentes de UI

### Cards

```vue
<!-- Card básico -->
<BaseCard title="Título">
  Conteúdo
</BaseCard>

<!-- Card com ações -->
<BaseCard title="Título">
  <template #header-actions>
    <BaseButton>Ação</BaseButton>
  </template>
  Conteúdo
</BaseCard>

<!-- Card clicável -->
<BaseCard title="Título" hover clickable>
  Conteúdo
</BaseCard>
```

### Stat Cards (KPIs)

```vue
<BaseStatCard
  title="Vendas do Mês"
  value="R$ 45.780"
  icon="lucide:wallet"
  icon-color="success"
  :change="{ value: 12.5, type: 'increase', label: 'vs mês anterior' }"
/>
```

### Badges

| Variante | Uso |
|----------|-----|
| `primary` | Categorias, tags principais |
| `secondary` | Tags neutras |
| `success` | Status positivos (ativo, pago, entregue) |
| `warning` | Status de atenção (pendente, estoque baixo) |
| `danger` | Status negativos (cancelado, erro) |
| `info` | Status informativos (em andamento) |

### Tabelas

```vue
<BaseTable
  :columns="columns"
  :data="data"
  :actions="actions"
  :loading="loading"
  empty-title="Nenhum registro"
  empty-description="Descrição do estado vazio"
>
  <template #cell-status="{ row }">
    <StatusBadge :status="row.status" :config="statusConfig" />
  </template>
</BaseTable>
```

### Formulários

```vue
<BaseInput
  v-model="form.name"
  label="Nome"
  placeholder="Digite o nome"
  required
  :error="errors.name"
/>

<BaseSelect
  v-model="form.category"
  label="Categoria"
  :options="categories"
  placeholder="Selecione"
/>

<BaseTextarea
  v-model="form.notes"
  label="Observações"
  :rows="4"
  show-count
  :max-length="500"
/>
```

## Estados Visuais

### Loading

```vue
<LoadingState text="Carregando dados..." />

<!-- Em tabelas/cards -->
<BaseTable :loading="true" />
```

### Empty

```vue
<BaseEmptyState
  icon="lucide:inbox"
  title="Nenhum registro encontrado"
  description="Adicione um novo registro para começar"
  action-label="Adicionar"
  @action="handleAdd"
/>
```

### Error

```vue
<ErrorState
  title="Erro ao carregar"
  message="Não foi possível carregar os dados"
  @retry="handleRetry"
/>
```

## Responsividade

### Breakpoints

| Nome | Valor | Uso |
|------|-------|-----|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop pequeno |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grande |

### Grid Responsivo

```vue
<AppCardGrid :cols="4">
  <!-- 1 col em mobile, 2 em sm, 4 em lg -->
</AppCardGrid>
```

### Sidebar

- **Expandido** - 280px em desktop
- **Colapsado** - 80px (apenas ícones)
- **Mobile** - Overlay com toggle

## Animações e Transições

### Transições de Página

```css
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
```

### Hover em Cards

```css
.card-hover {
  transition: box-shadow 0.2s ease;
}

.card-hover:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Modais

- Fade in do backdrop
- Scale + fade do conteúdo
- Duração: 200ms entrada, 150ms saída

## Acessibilidade

- Foco visível com ring
- Contraste adequado de cores
- Labels em todos os inputs
- Estados disabled claros
- Ícones com título/aria-label
- Navegação por teclado
