# Sistema de UI (Design System)

Documentação do visual do CRM Eleve Imports: princípios, tokens, classes utilitárias e componentes base. Use isto como referência ao criar novas telas para manter **consistência** e **baixa fadiga visual**.

## Princípios visuais

1. **Clareza** — Uma ação primária óbvia por contexto; texto legível; números com `tabular-nums` quando fizer sentido (KPIs, valores).
2. **Calma / superfície plana** — Preferir **borda + fundo branco** sem sombra nas listagens e KPIs; raio `rounded-lg`; cor só onde há significado (status, tendência, CTA). Ícones de métrica costumam ser neutros (`slate-100` / `slate-600`).
3. **Hierarquia** — Título de página (`font-semibold`, `text-xl`–`text-2xl`) > seção > card; descrições em `text-slate-500`, `text-sm`.
4. **Consistência** — Preferir classes globais em `app/assets/css/main.css` (`.btn`, `.card`, `.surface-*`) em vez de reestilizar cada tela.
5. **Propósito da cor** — Azul (`primary`) para ação e foco; verde/âmbar/vermelho para semântica (sucesso, atenção, erro); cinzas para estrutura.

## Tokens (CSS)

Definidos em `:root` em `main.css`:

| Token | Uso |
|--------|-----|
| `--sidebar-width` / `--sidebar-collapsed-width` | Largura da sidebar |
| `--header-height` | Altura do header |
| `--radius-card` | Raio base de cards (alinhado a `rounded-lg`) |
| `--shadow-surface` | `none` — painéis sem sombra (só borda) |
| `--border-subtle` | Referência HSL para bordas suaves |

## Espaçamento e ritmo

- **Página:** `p-4 lg:p-8` + `space-y-6` entre blocos principais.
- **Grid de KPIs:** `gap-4` (mobile) / `gap-4 lg:gap-6` (desktop).
- **Entre título de seção e conteúdo:** `mb-4`–`mb-6` conforme densidade.
- **Formulários:** label + `mb-1.5` + campo; agrupar campos relacionados com `space-y-4` ou `gap-4` em grid.

Evite misturar `p-5` e `p-6` na mesma coluna sem motivo; para filtros use `.surface-toolbar` (padding já definido).

## Cores

| Papel | Tailwind / uso |
|--------|----------------|
| Fundo app | `bg-slate-50` |
| Superfície | `bg-white` + borda `border-slate-200` |
| Texto principal | `text-slate-900` |
| Texto secundário | `text-slate-500`, `text-sm` |
| Ação / links | `primary-600`–`primary-700`, foco com ring suave |
| Sidebar | `bg-slate-900`, itens inativos `text-slate-400`, ativo `bg-white/10` |

## Classes utilitárias (superfícies)

| Classe | Quando usar |
|--------|-------------|
| `.surface-metric` | Cards de KPI / estatísticas em grid (padding `p-5`) |
| `.surface-panel` | Blocos com cabeçalho + lista/tabela, borda única, `overflow-hidden` |
| `.surface-toolbar` | Barras de busca + filtros (padding `p-4 lg:p-5`) |
| `.card` | `BaseCard` e conteúdo com header/body/footer |
| `.card-hover` | Card interativo — hover com borda + fundo leve, sem sombra |

## Botões (`.btn-*`)

- **primary:** preenchido `primary-600`, sem sombra, sem gradiente.
- **secondary / outline / ghost:** peso visual decrescente.
- **danger / success:** sólidos, uso pontual.

Tamanhos: `.btn-sm`, padrão (md), `.btn-lg`, `.btn-icon`.

Header de página: ações devem usar estas classes (ver `AppPageHeader.vue`).

## Formulários

- **Inputs:** `.form-input` — fundo branco, borda discreta, foco com `ring-primary-500/15`.
- **Select:** `.form-select` (herda estilo do input + seta).
- **Erro:** `.form-error`; **dica:** `.form-hint`.

## Tabelas (`.table`)

- Cabeçalho: fundo `bg-slate-50`, borda inferior `border-slate-200`, texto `text-xs font-medium` (sem uppercase obrigatório).
- Linhas: borda inferior leve, hover `hover:bg-slate-50`.
- **BaseTable:** overlay de loading via `.loading-overlay` + `.loading-spinner`.

## Layout

- **Admin:** fundo plano `bg-slate-50` (sem gradiente na página).
- **Header:** `bg-white`, borda inferior; dropdowns só borda + `rounded-lg` (sem sombra pesada).
- **Sidebar:** sem badges fictícios; ícone alinhado ao texto (sem “caixa” extra por item); item ativo com fundo suave.

## Componentes base

| Componente | Notas |
|------------|--------|
| `BaseCard` | Usa `.card`; título de card em `text-sm font-semibold` |
| `BaseStatCard` | KPI plano; ícone colorido opcional (padrão `slate`); `rounded-lg` |
| `BaseButton` | Variantes mapeadas para `.btn-*` |
| `BaseTable` | Estilos globais `.table`; loading overlay incluído |
| `BaseModal` | `rounded-lg`, borda (sem sombra forte) |
| `BaseFilterBar` | Barra clara com borda (não cinza “bloco” pesado) |
| `BaseSection` | Classes `.section`, `.section-header`, `.section-title` em `main.css` |
| `AppPageHeader` | Título semibold; ações com design system |

## Microinterações

- Transições curtas: `duration-150`–`duration-200` em cores e sombras.
- Hover em listas/tabelas: mudança de fundo, não escala agressiva.
- Foco global: `ring-primary-500/35` com offset (acessível sem “neon”).

## Boas práticas para novas telas

1. Reutilizar `AppPageHeader` + `surface-metric` / `surface-panel` antes de inventar novos wrappers.
2. Não adicionar gradientes em cards de listagem; reservar cor sólida só para **um** destaque (ex.: KPI principal).
3. Manter **uma** densidade por página: ou listagem compacta ou formulário espaçado, sem alternar sem critério.
4. Ícones em métricas: preferir fundo neutro `bg-slate-100` + ícone `text-slate-600`; `rounded-md` ou `rounded-lg`.
5. Após alterar estilos globais, rodar `npm run build` e inspecionar 2–3 fluxos (lista, formulário, modal).

## Referências de arquivo

- Tokens e componentes CSS: `app/assets/css/main.css`
- Sombras estendidas: `tailwind.config.ts` → `theme.extend.boxShadow`
- Layout admin: `app/layouts/admin.vue`
- Sidebar / Header: `app/components/layout/AppSidebar.vue`, `AppHeader.vue`
