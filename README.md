# ASCESA - Plataforma Digital da Associação

Plataforma digital para gerenciamento da associação de funcionários do Sicoob.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Email**: Resend
- **Docker**: Docker Compose para desenvolvimento

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- Docker (opcional)

## 🔧 Instalação

```bash
# Instalar todas as dependências
npm run install

# ou individualmente
cd api && npm install
cd web && npm install
```

## ▶️ Executando

```bash
# Desenvolvimento - API e Web
npm run dev

# Apenas API
npm run dev:api

# Apenas Web
npm run dev:web
```

## 🐳 Docker

```bash
# Subir containers
npm run docker:up

# Parar containers
npm run docker:down
```

## 📁 Estrutura

```
ascesa/
├── api/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/       # Autenticação
│   │   ├── benefits/   # Benefícios
│   │   ├── partners/   # Parceiros
│   │   ├── users/      # Usuários
│   │   └── prisma/     # Schema do banco
│   └── prisma/         # Migrações
├── web/                # Frontend Next.js
│   ├── src/
│   │   ├── app/        # Páginas
│   │   ├── components/  # Componentes React
│   │   ├── hooks/      # Hooks customizados
│   │   └── lib/        # Utilitários
└── .github/            # GitHub Actions
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/ascesa_db

# JWT
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=15m

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Segurança
ALLOWED_ORIGINS=http://localhost:3000
```

## 📝 Licença

Privado - Todos os direitos reservados
# CI Test
