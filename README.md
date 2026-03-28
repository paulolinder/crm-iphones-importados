# Eleve Imports CRM

<div align="center">

![Nuxt](https://img.shields.io/badge/Nuxt-4.0-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.45-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Sistema de Gestão completo para Loja de iPhones e Produtos Importados**

</div>

---

## 📋 Sobre o Projeto

O **Eleve Imports CRM** é um sistema de gestão empresarial desenvolvido especificamente para lojas de iPhones e produtos importados. Oferece controle completo de clientes, produtos, estoque, vendas, financeiro e muito mais.

### Funcionalidades Principais

- 📊 **Dashboard** - Visão geral do negócio com KPIs e métricas
- 👥 **Clientes** - Cadastro e gestão de clientes
- 📦 **Produtos** - Catálogo com categorias e marcas
- 🏷️ **Estoque** - Controle por IMEI/Serial
- 🛒 **Vendas** - Gestão de pedidos e vendas
- 💰 **Financeiro** - Fluxo de caixa, contas a pagar/receber
- 🛡️ **Garantias** - Controle de garantias de produtos
- 🔧 **Assistência** - Ordens de serviço técnico
- 👤 **Usuários** - Gestão de acessos e permissões
- 📈 **Relatórios** - Análises e relatórios gerenciais
- ⚙️ **Configurações** - Personalização do sistema

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Nuxt** | 4.0 | Framework Vue.js |
| **Vue** | 3.5 | Framework reativo |
| **TypeScript** | 5.6 | Tipagem estática |
| **Tailwind CSS** | 3.4 | Estilização |
| **Supabase** | 2.45 | Backend/Database |
| **Pinia** | 2.2 | State management |
| **VueUse** | 11.0 | Composables utilitários |

---

## 📁 Estrutura do Projeto

```
eleve-imports-crm/
├── app/                    # Código fonte principal (Nuxt 4)
│   ├── assets/            # CSS, imagens
│   ├── components/        # Componentes Vue
│   │   ├── base/         # Componentes base reutilizáveis
│   │   ├── layout/       # Sidebar, Header, etc
│   │   └── shared/       # Componentes compartilhados
│   ├── composables/       # Composables Vue
│   ├── layouts/           # Layouts (admin, auth, default)
│   ├── lib/              # Bibliotecas (Supabase, helpers)
│   ├── pages/            # Páginas/Rotas
│   ├── plugins/          # Plugins Nuxt
│   └── types/            # Tipos TypeScript
├── domains/               # Módulos de domínio
├── server/               # API routes (Nitro)
├── docs/                 # Documentação
├── .ai/                  # Instruções para IA
├── Dockerfile            # Container de produção
└── nuxt.config.ts        # Configuração Nuxt
```

---

## ⚡ Quick Start

### Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/crm-iphones-importados.git
cd crm-iphones-importados

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Inicia em modo produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Executa linter |
| `npm run lint:fix` | Corrige erros de lint |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run docker:build` | Build da imagem Docker |
| `npm run docker:run` | Executa container Docker |

---

## 🔧 Configuração de Ambiente

### Variáveis Obrigatórias

```env
# Supabase (obrigatório)
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key

# Produção
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
```

Veja o arquivo `.env.example` para lista completa.

---

## 🐳 Docker

### Build

```bash
docker build -t eleve-imports-crm \
  --build-arg NUXT_PUBLIC_SUPABASE_URL=https://migxevookiubncmcsgvy.supabase.co \
  --build-arg NUXT_PUBLIC_SUPABASE_KEY=sua-chave \
  .
```

### Run

```bash
docker run -p 3000:3000 --env-file .env eleve-imports-crm
```

---

## 🚀 Deploy

### Easypanel (Recomendado)

1. Conecte o repositório GitHub ao Easypanel
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Start command: `node .output/server/index.mjs`
5. Port: `3000`

📖 Veja o guia completo em: [`docs/deploy.md`](./docs/deploy.md)

### Outras plataformas

O projeto é compatível com:
- Vercel
- Netlify
- Railway
- Render
- Qualquer plataforma com suporte a Node.js ou Docker

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [`docs/architecture.md`](./docs/architecture.md) | Arquitetura do sistema |
| [`docs/deploy.md`](./docs/deploy.md) | Guia de deploy |
| [`docs/component-guidelines.md`](./docs/component-guidelines.md) | Padrões de componentes |
| [`docs/naming-conventions.md`](./docs/naming-conventions.md) | Convenções de nomenclatura |
| [`docs/supabase-guidelines.md`](./docs/supabase-guidelines.md) | Integração Supabase |
| [`docs/ui-system.md`](./docs/ui-system.md) | Sistema de UI |

---

## 🔒 Segurança

- Nunca commite o arquivo `.env`
- Use variáveis de ambiente para credenciais
- `SUPABASE_SERVICE_KEY` é server-side only
- RLS (Row Level Security) habilitado no Supabase
- Validação de inputs com Zod

---

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.

---

## 👥 Equipe

Desenvolvido por **Eleve Imports**

---

<div align="center">

**Eleve Imports CRM** - Sistema de Gestão Premium

</div>
