# Deploy Guide - Eleve Imports CRM

Este documento contém instruções completas para deploy do sistema em produção.

## Índice

1. [Requisitos](#requisitos)
2. [Desenvolvimento Local](#desenvolvimento-local)
3. [Build de Produção](#build-de-produção)
4. [Deploy no Easypanel](#deploy-no-easypanel)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Docker](#docker)
7. [Troubleshooting](#troubleshooting)
8. [Atualizações](#atualizações)

---

## Requisitos

### Sistema
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker (para builds containerizados)

### Serviços Externos
- Supabase Project (ID: `migxevookiubncmcsgvy`)
- GitHub (para versionamento)
- Easypanel (para hosting)

---

## Desenvolvimento Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/crm-iphones-importados.git
cd crm-iphones-importados
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

---

## Build de Produção

### Build local

```bash
npm run build
```

O build será gerado na pasta `.output/`

### Preview do build

```bash
npm run preview
```

### Iniciar em produção

```bash
npm run start
```

---

## Deploy no Easypanel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Acesse o Easypanel**
   - Faça login no seu painel Easypanel

2. **Crie uma nova aplicação**
   - Clique em "Create App"
   - Selecione "App"
   - Escolha "GitHub"

3. **Conecte o repositório**
   - Autorize o Easypanel no GitHub (se necessário)
   - Selecione o repositório `crm-iphones-importados`
   - Branch: `main`

4. **Configure o Build**
   - Build Command: `npm run build`
   - Start Command: `node .output/server/index.mjs`
   - Port: `3000`

5. **Configure as Variáveis de Ambiente**
   No painel de Environment Variables, adicione:

   | Variável | Valor | Descrição |
   |----------|-------|-----------|
   | `NODE_ENV` | `production` | Ambiente de produção |
   | `NUXT_PUBLIC_SUPABASE_URL` | `https://migxevookiubncmcsgvy.supabase.co` | URL do Supabase |
   | `NUXT_PUBLIC_SUPABASE_KEY` | `sua-anon-key` | Chave pública do Supabase |
   | `SUPABASE_SERVICE_KEY` | `sua-service-key` | Chave privada (server-side) |
   | `HOST` | `0.0.0.0` | Host do servidor |
   | `PORT` | `3000` | Porta do servidor |

6. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar

### Opção 2: Deploy via Dockerfile

1. **Crie a aplicação no Easypanel**
   - Escolha "Docker" como tipo

2. **Configure o Dockerfile**
   - O Easypanel usará o `Dockerfile` do repositório

3. **Build Arguments**
   Configure os seguintes build args:
   ```
   NUXT_PUBLIC_SUPABASE_URL=https://migxevookiubncmcsgvy.supabase.co
   NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key
   ```

4. **Runtime Environment**
   ```
   NODE_ENV=production
   SUPABASE_SERVICE_KEY=sua-service-key
   ```

5. **Porta**
   - Container Port: `3000`
   - Expose: `3000`

---

## Variáveis de Ambiente

### Públicas (Frontend)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `NUXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NUXT_PUBLIC_SUPABASE_KEY` | Sim | Chave anon/public do Supabase |
| `NUXT_PUBLIC_APP_NAME` | Não | Nome da aplicação |
| `NUXT_PUBLIC_APP_VERSION` | Não | Versão da aplicação |

### Privadas (Server-side)

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `SUPABASE_SERVICE_KEY` | Sim | Service role key (NUNCA expor no frontend) |
| `NODE_ENV` | Sim | `production` ou `development` |

### Servidor

| Variável | Default | Descrição |
|----------|---------|-----------|
| `HOST` | `0.0.0.0` | Host do servidor |
| `PORT` | `3000` | Porta do servidor |
| `NITRO_HOST` | `0.0.0.0` | Host do Nitro |
| `NITRO_PORT` | `3000` | Porta do Nitro |

---

## Docker

### Build da imagem

```bash
docker build -t eleve-imports-crm \
  --build-arg NUXT_PUBLIC_SUPABASE_URL=https://migxevookiubncmcsgvy.supabase.co \
  --build-arg NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key \
  .
```

### Executar container

```bash
docker run -d \
  --name eleve-crm \
  -p 3000:3000 \
  -e SUPABASE_SERVICE_KEY=sua-service-key \
  -e NODE_ENV=production \
  eleve-imports-crm
```

### Health Check

O container possui health check configurado:
- Endpoint: `GET /api/health`
- Intervalo: 30 segundos
- Timeout: 10 segundos

---

## Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules .nuxt .output
npm install
npm run build
```

### Erro: "Port already in use"
```bash
# Linux/Mac
lsof -i :3000 | kill
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro no Supabase
1. Verifique as variáveis de ambiente
2. Confirme que as chaves estão corretas
3. Verifique se o projeto Supabase está ativo

### Build falha no Docker
1. Verifique se o `.dockerignore` não está excluindo arquivos necessários
2. Aumente a memória disponível para o Docker
3. Limpe o cache: `docker system prune`

---

## Atualizações

### Atualizar em produção

1. **Via Easypanel + GitHub:**
   - Push para a branch `main`
   - O Easypanel detectará e fará redeploy automático

2. **Via Docker manual:**
   ```bash
   docker pull seu-registro/eleve-imports-crm:latest
   docker stop eleve-crm
   docker rm eleve-crm
   docker run -d --name eleve-crm -p 3000:3000 --env-file .env eleve-imports-crm
   ```

### Rollback

1. No Easypanel, acesse "Deployments"
2. Selecione uma versão anterior
3. Clique em "Redeploy"

---

## Contato

Para suporte técnico, entre em contato com a equipe de desenvolvimento.
