# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASCESA is a digital platform for Sicoob employees association containing:
- **Web**: Next.js 14 frontend with React
- **API**: NestJS backend with PostgreSQL
- Mobile app (future): React Native/Expo

## Common Commands

### From project root (`D:\projetos\ascesa`)

```bash
# Install all dependencies
npm run install

# Run both web and API in development
npm run dev

# Run only web (Next.js)
npm run dev:web

# Run only API (NestJS)
npm run dev:api

# Build production
npm run build:web
npm run build:api

# Start production
npm run start:web
npm run start:api

# Docker
npm run docker:up
npm run docker:down
```

### Web commands (`cd web`)

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

### API commands (`cd api`)

```bash
npm run start:dev       # Development with hot-reload
npm run build           # Production build
npm run start:prod      # Production start
npm run lint            # ESLint check
npm run test            # Run tests
```

## Architecture

### Web Structure (`web/src/`)

- `app/` - Next.js App Router pages and routes
  - `/admin/*` - Admin panel pages (requires ADMIN/DIRECTOR role)
  - `/dashboard/*` - Protected user dashboard
  - `/benefits/*` - Public benefits listing
  - `/blog/*` - Blog posts
- `components/` - React components
  - `admin/` - Admin-specific components (AdminLayout, FilterBar, FormModal)
  - `ui/` - Reusable UI components (Button, Input, Card, Toast, etc.)
- `hooks/` - Custom React hooks (useAdminAuth, useDebounce)
- `lib/` - Utilities and API client
- `constants/` - Application constants (categories, status labels)

### API Structure (`api/src/`)

- `auth/` - Authentication module (JWT, login, register)
- `benefits/` - Benefits CRUD module
- `partners/` - Partners CRUD module
- `documents/` - Documents module
- `users/` - User management module
- `prisma/` - Database schema and migrations

### Database

Uses Prisma ORM with PostgreSQL. Schema uses Portuguese field names with `@map` for database compatibility:
- `Usuario` (mapped to `users`)
- `Associado` (mapped to `associates`)
- `Beneficio` (mapped to `benefits`)
- `Parceiro` (mapped to `partners`)

## Key Patterns

### Admin Pages
- Use `'use client'` directive
- Use `useAdminAuth` hook for authentication (checks ADMIN/DIRECTOR role)
- Handle SSR by checking `mounted` state before accessing localStorage
- Use reusable components: `AdminLayout`, `FilterBar`, `FormModal`, `StatusBadge`

### API Responses
- Return `{ success: boolean, data?: any, message?: string }` format
- Portuguese status values: `ATIVO`, `INATIVO`, `PENDENTE`, `APROVADO`, `REJEITADO`

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `RESEND_API_KEY` - Email service

## Port Configuration

- Web: 3000 (or 3001, 3002 if occupied)
- API: 3000
- PostgreSQL: 5432 (docker)
- Swagger: `/api/docs`
