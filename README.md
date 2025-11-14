# 🏢 Portal NewLoc - Sistema de Gestão de Documentos

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

Sistema web moderno de gestão de documentos e remessas para NewLoc Locações (CNPJ 30.054.421/0001-66).

## 🎯 Visão Geral

O Portal NewLoc é uma aplicação web estilo aplicativo mobile que permite gerenciar documentos, remessas, contratos e patrimônios de forma segura e eficiente.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura** - Sistema de login com bcrypt e sessões
- 👥 **Múltiplos Níveis de Acesso** - Admin e Cliente com permissões diferenciadas
- 📄 **Gestão de Documentos** - Upload, visualização e download de documentos
- 🖼️ **Imagens em Base64** - Armazenamento otimizado de imagens
- 📊 **Dashboard Interativo** - Cards com preview e informações detalhadas
- 🔄 **Integração n8n** - API RESTful pronta para automações
- 🐳 **Deploy com Docker** - Containerização completa da aplicação
- 🔒 **SSL/HTTPS** - Suporte completo para certificados SSL

### 🎨 Identidade Visual

- **Cores:** Preto (#000000) + Amarelo (#f4c400)
- **Design:** Interface moderna estilo aplicativo mobile
- **Responsividade:** Funciona perfeitamente em desktop e mobile

## 📦 Tecnologias

- **Frontend:** Next.js 14.2, React 18, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco de Dados:** PostgreSQL 15
- **Autenticação:** bcrypt, JWT, Sessions
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Containerização:** Docker, Docker Compose
- **Proxy Reverso:** NGINX
- **SSL:** Let's Encrypt / Certbot

## 🚀 Quick Start

### Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 20+ (apenas para desenvolvimento local)

### Deploy com Docker (Produção)

```bash
# 1. Clone o repositório
git clone https://seu-repositorio.git
cd portal_newloc

# 2. Configure as variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações

# 3. Execute o script de deploy
chmod +x deploy.sh
./deploy.sh

# 4. Acesse a aplicação
# http://localhost:3000
```

### Credenciais Padrão

**Admin:**
- Email: `admin@newloc.com`
- Senha: `Admin@123`

⚠️ **Altere a senha após o primeiro login!**

## 📁 Estrutura do Projeto

```
portal_newloc/
├── nextjs_space/           # Código-fonte da aplicação
│   ├── app/               # Rotas e páginas (App Router)
│   │   ├── api/          # Endpoints da API
│   │   ├── dashboard/    # Painel principal
│   │   ├── documento/    # Visualização de documentos
│   │   ├── login/        # Página de login
│   │   └── usuarios/     # Gestão de usuários
│   ├── components/        # Componentes React reutilizáveis
│   ├── lib/              # Utilitários e helpers
│   ├── prisma/           # Schema e migrations do banco
│   └── public/           # Assets estáticos
├── Dockerfile            # Build da aplicação
├── docker-compose.yml    # Orquestração dos serviços
├── nginx.conf           # Configuração do NGINX
├── deploy.sh            # Script de deploy automatizado
├── backup.sh            # Script de backup do banco
├── .env.example         # Template de variáveis de ambiente
├── API_DOCUMENTATION.md # Documentação completa da API
├── N8N_INTEGRATION.md   # Guia de integração com n8n
├── DEPLOY_GUIDE.md      # Guia completo de deploy
└── README.md            # Este arquivo
```

## 📚 Documentação

- **[Guia de Deploy](DEPLOY_GUIDE.md)** - Instruções completas para deploy em produção
- **[Documentação da API](API_DOCUMENTATION.md)** - Referência completa das rotas da API
- **[Integração n8n](N8N_INTEGRATION.md)** - Guia de integração e workflows

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Sessões com tokens únicos
- ✅ HttpOnly cookies
- ✅ CORS configurável
- ✅ Rate limiting no NGINX
- ✅ Sanitização de inputs
- ✅ Validação de permissões em todas as rotas
- ✅ SSL/HTTPS em produção

## 🛣️ Rotas da API

| Endpoint | Método | Descrição | Auth |
|----------|--------|-----------|------|
| `/api/health` | GET | Health check | Não |
| `/api/auth/login` | POST | Autenticação | Não |
| `/api/auth/logout` | POST | Encerrar sessão | Sim |
| `/api/documentos` | GET | Listar documentos | Sim |
| `/api/documento/:id` | GET | Obter documento | Sim |
| `/api/usuarios` | GET | Listar usuários | Admin |
| `/api/usuarios` | POST | Criar usuário | Admin |

Veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para detalhes completos.

## 🐳 Serviços Docker

| Serviço | Container | Porta | Descrição |
|---------|-----------|-------|-----------|
| web | `newloc_web` | 3000 | Aplicação Next.js |
| db | `newloc_postgres` | 5432 | Banco PostgreSQL |
| adminer | `newloc_adminer` | 8080 | Gerenciamento do banco (opcional) |

## 📊 Banco de Dados

### Tabelas Principais

- **usuarios_portal** - Usuários do sistema
- **sessions_portal** - Sessões ativas
- **documentos_operacoes** - Documentos e remessas

Veja `nextjs_space/prisma/schema.prisma` para o schema completo.

## 🔄 Scripts Disponíveis

```bash
# Deploy da aplicação
./deploy.sh

# Backup do banco de dados
./backup.sh

# Ver logs em tempo real
docker compose logs -f

# Reiniciar serviços
docker compose restart

# Parar todos os serviços
docker compose down
```

## 🧪 Desenvolvimento Local

```bash
# Entrar na pasta do código
cd nextjs_space

# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Iniciar em modo desenvolvimento
yarn dev

# Aplicação rodará em http://localhost:3000
```

## 📝 Variáveis de Ambiente

Principais variáveis necessárias:

```bash
# Banco de Dados
DATABASE_URL=postgresql://user:password@host:5432/database

# Autenticação
NEXTAUTH_SECRET=secret_key_32_chars
JWT_SECRET=another_secret_32_chars

# URLs
NEXTAUTH_URL=https://app.newloc.com
NEXT_PUBLIC_BASE_URL=https://app.newloc.com

# Ambiente
NODE_ENV=production
```

Veja `.env.example` para a lista completa.

## 🔧 Manutenção

### Backup Automático

Configure cron job para backups diários:

```bash
crontab -e

# Adicionar:
0 3 * * * cd /opt/portal_newloc && ./backup.sh
```

### Atualização da Aplicação

```bash
# Usar script de deploy
./deploy.sh
# Selecionar opção: 2) Atualizar aplicação

# Ou manualmente:
docker compose pull
docker compose up -d --build
docker compose exec web npx prisma migrate deploy
```

### Logs e Monitoramento

```bash
# Logs da aplicação
docker compose logs -f web

# Logs do banco
docker compose logs -f db

# Logs do NGINX
sudo tail -f /var/log/nginx/newloc_access.log

# Status dos containers
docker compose ps

# Uso de recursos
docker stats
```

## 🐛 Troubleshooting

### Aplicação não inicia

```bash
docker compose logs web
docker compose restart web
```

### Erro de conexão com banco

```bash
docker compose exec db pg_isready -U postgres
docker compose restart db
```

### NGINX 502 Bad Gateway

```bash
curl http://localhost:3000/api/health
sudo nginx -t
sudo systemctl restart nginx
```

Veja [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) para mais soluções.

## 🔗 Integração com n8n

O Portal NewLoc possui API RESTful completa para integração com n8n ou outras ferramentas de automação.

Exemplos de uso:
- Receber imagens do WhatsApp via Evolution API
- Criar documentos automaticamente
- Notificar clientes via email/SMS
- Sincronizar com outros sistemas

Veja [N8N_INTEGRATION.md](N8N_INTEGRATION.md) para workflows de exemplo.

## 📊 Permissões de Usuário

### Admin
- ✅ Visualizar todos os documentos
- ✅ Criar, editar e deletar documentos
- ✅ Gerenciar usuários (criar clientes)
- ✅ Acessar todas as funcionalidades

### Cliente
- ✅ Visualizar apenas documentos do próprio cliente
- ✅ Baixar imagens dos documentos
- ❌ Não pode criar usuários
- ❌ Não pode ver dados de outros clientes

## 🌐 Domínio e SSL

### Configurar Domínio

1. Apontar DNS para o servidor:
   ```
   A    app.newloc.com    SEU_IP_SERVIDOR
   ```

2. Aguardar propagação DNS (até 48h)

3. Configurar SSL com Let's Encrypt:
   ```bash
   sudo certbot --nginx -d app.newloc.com
   ```

Veja [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) para instruções detalhadas.

## 📱 Compatibilidade

- ✅ Google Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contribuindo

Este é um projeto proprietário da NewLoc Locações.

## 📄 Licença

Copyright © 2024 NewLoc Locações - CNPJ 30.054.421/0001-66

Todos os direitos reservados.

## 📞 Suporte

Para suporte técnico:
- 📧 Email: suporte@newloc.com
- 📱 Telefone: (XX) XXXX-XXXX
- 🌐 Site: https://newloc.com

---

**🚀 Desenvolvido para NewLoc Locações**

*Gestão de documentos simples, moderna e segura.*
