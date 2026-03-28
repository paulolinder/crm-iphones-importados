# Cobertura de rotas do painel admin

Este documento descreve a matriz de navegação após a etapa de eliminação de 404s: menus, ações principais e rotas implementadas.

## Padrão adotado

- **Listagem:** `/admin/<módulo>`
- **Novo:** `/admin/<módulo>/novo` ou `nova` (quando o nome em português faz sentido)
- **Detalhe:** `/admin/<módulo>/[id]`
- **Editar:** `/admin/<módulo>/[id]/editar`
- **Submódulos:** pastas adicionais sob o módulo (ex.: `financeiro/lancamentos`)
- Layout: `admin` (`definePageMeta({ layout: 'admin' })`)
- **Placeholder:** páginas com `AdminPlaceholderNotice` e/ou `AdminFieldStub` aguardam integração completa com backend

## Sidebar (`AppSidebar.vue`)

| Item        | Rota |
|------------|------|
| Dashboard  | `/admin/dashboard` |
| Clientes   | `/admin/clientes` |
| Vendas     | `/admin/vendas` |
| Pedidos    | `/admin/pedidos` → redireciona para `/admin/vendas` |
| Produtos   | `/admin/produtos` |
| Categorias | `/admin/produtos/categorias` |
| Marcas     | `/admin/produtos/marcas` |
| Estoque    | `/admin/estoque` |
| Fornecedores | `/admin/fornecedores` |
| Financeiro | `/admin/financeiro` |
| Garantias  | `/admin/garantias` |
| Assistência | `/admin/assistencia` |
| Relatórios | `/admin/relatorios` |
| Usuários   | `/admin/usuarios` |
| Permissões | `/admin/permissoes` |
| Configurações | `/admin/configuracoes` |

## Header / ações globais (`AppHeader.vue`)

- Atalhos: Nova Venda → `/admin/vendas/nova`, Novo Cliente → `/admin/clientes/novo`, Novo Produto → `/admin/produtos/novo`
- Meu Perfil → `/admin/configuracoes/perfil`
- Notificações “Ver todas” → `/admin/notificacoes`

## Rotas por módulo

### Dashboard

| Rota | Arquivo | Notas |
|------|---------|--------|
| `/admin` | `pages/admin/index.vue` | Redireciona para dashboard |
| `/admin/dashboard` | `pages/admin/dashboard/index.vue` | Pedidos recentes linkam para `/admin/vendas/[id]` (IDs mock até integrar lista real) |

### Clientes

| Rota | Notas |
|------|--------|
| `/admin/clientes` | Lista real (Supabase) |
| `/admin/clientes/novo` | Formulário real |
| `/admin/clientes/[id]` | Detalhe real |
| `/admin/clientes/[id]/editar` | Edição real |
| `/admin/clientes/exportar` | Placeholder exportação |

### Produtos e catálogo

| Rota | Notas |
|------|--------|
| `/admin/produtos` | Lista real; ações Categorias, Marcas, Importar |
| `/admin/produtos/novo` | Formulário real |
| `/admin/produtos/[id]` | Detalhe real |
| `/admin/produtos/[id]/editar` | Edição real |
| `/admin/produtos/categorias` | Lista via service |
| `/admin/produtos/categorias/nova` | Placeholder |
| `/admin/produtos/categorias/[id]/editar` | Placeholder |
| `/admin/produtos/marcas` | Lista via service |
| `/admin/produtos/marcas/nova` | Placeholder |
| `/admin/produtos/marcas/[id]/editar` | Placeholder |
| `/admin/produtos/importar` | Placeholder importação |

### Estoque

| Rota | Notas |
|------|--------|
| `/admin/estoque` | Visão geral real |
| `/admin/estoque/entrada` | Entrada real |
| `/admin/estoque/movimentacoes` | Lista de movimentações (dados reais) |
| `/admin/estoque/entradas` | Hub + link para entrada |
| `/admin/estoque/saida` | Formulário placeholder |
| `/admin/estoque/ajustes` | Placeholder ajuste |

### Fornecedores

| Rota | Notas |
|------|--------|
| `/admin/fornecedores` | Mock listagem UI |
| `/admin/fornecedores/novo` | Placeholder |
| `/admin/fornecedores/[id]` | Placeholder detalhe |
| `/admin/fornecedores/[id]/editar` | Placeholder |

### Vendas e pedidos

| Rota | Notas |
|------|--------|
| `/admin/vendas` | Lista real |
| `/admin/vendas/nova` | Criação real |
| `/admin/vendas/[id]` | Detalhe real |
| `/admin/vendas/[id]/editar` | Placeholder edição (dados carregados) |
| `/admin/vendas/exportar` | Placeholder |
| `/admin/pedidos` | Redireciona → vendas |
| `/admin/pedidos/[id]` | Redireciona → `/admin/vendas/[id]` |

### Financeiro

| Rota | Notas |
|------|--------|
| `/admin/financeiro` | Resumo + atalhos + transações |
| `/admin/financeiro/caixa` | Placeholder |
| `/admin/financeiro/contas-pagar` | Placeholder lista |
| `/admin/financeiro/contas-pagar/nova` | Placeholder |
| `/admin/financeiro/contas-receber` | Placeholder lista |
| `/admin/financeiro/contas-receber/nova` | Placeholder |
| `/admin/financeiro/lancamentos` | Lista real |
| `/admin/financeiro/lancamentos/novo` | Criação real (`registerTransaction`) |
| `/admin/financeiro/exportar` | Placeholder |

### Garantias e assistência

| Rota | Notas |
|------|--------|
| `/admin/garantias` | Mock + linha clicável → detalhe |
| `/admin/garantias/nova` | Placeholder |
| `/admin/garantias/[id]` | Placeholder detalhe |
| `/admin/assistencia` | Mock |
| `/admin/assistencia/nova` | Placeholder |
| `/admin/assistencia/[id]` | Placeholder |
| `/admin/assistencia/[id]/editar` | Placeholder |

### Usuários e permissões

| Rota | Notas |
|------|--------|
| `/admin/usuarios` | Mock + links perfil/editar |
| `/admin/usuarios/novo` | Placeholder |
| `/admin/usuarios/[id]` | Placeholder |
| `/admin/usuarios/[id]/editar` | Placeholder |
| `/admin/permissoes` | Matriz visual (somente leitura) |

### Relatórios

| Rota | Notas |
|------|--------|
| `/admin/relatorios` | Existente; cards ainda sem sub-rotas dedicadas (podem ser adicionadas na próxima etapa) |

### Configurações

| Rota | Notas |
|------|--------|
| `/admin/configuracoes` | Hub |
| `/admin/configuracoes/empresa` | Placeholder |
| `/admin/configuracoes/perfil` | Placeholder |
| `/admin/configuracoes/categorias` | Atalho + texto |
| `/admin/configuracoes/marcas` | Atalho + texto |
| `/admin/configuracoes/pagamentos` | Placeholder |
| `/admin/configuracoes/impostos` | Placeholder |
| `/admin/configuracoes/notificacoes` | Placeholder |
| `/admin/configuracoes/integracoes` | Placeholder |
| `/admin/configuracoes/backup` | Placeholder |
| `/admin/configuracoes/sistema` | Placeholder |
| `/admin/configuracoes/usuarios` | Atalhos para usuários e permissões |

### Outros

| Rota | Notas |
|------|--------|
| `/admin/notificacoes` | Lista placeholder |

## Componentes reutilizados (novos)

- `app/components/admin/AdminPlaceholderNotice.vue` — faixa “em integração”
- `app/components/admin/AdminFormGrid.vue` — grid de formulário
- `app/components/admin/AdminFieldStub.vue` — campo desabilitado para mock visual

## Links corrigidos (resumo)

- Exportar clientes, produtos (importar), vendas → rotas dedicadas
- Ver detalhes (olho) em clientes e produtos → `[id]` em vez de só editar
- Vendas: ícone olho → `/admin/vendas/[id]`
- Estoque: Saída, Movimentações com rotas reais
- Financeiro: Nova transação, Exportar, Ver todas → lançamentos; faixa de atalhos (caixa, contas, etc.)
- Garantias: Nova garantia + clique na linha → detalhe
- Assistência: ícones → detalhe / editar
- Usuários: cards com Perfil / Editar + atalho Permissões
- Header notificações → `/admin/notificacoes`
- Dashboard: linhas de pedidos recentes → `NuxtLink` para venda

## Validação

- `npm run build` concluído com sucesso após as alterações.

## Próximos passos sugeridos

- Integrar dashboard “pedidos recentes” com IDs reais de `orders`
- Substituir mocks de fornecedores, garantias, assistência e usuários por services Supabase
- Sub-rotas opcionais em Relatórios (`/admin/relatorios/vendas`, etc.) se quiser um relatório por URL
