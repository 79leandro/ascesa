# ASCESA - Planejamento do Projeto

## Visão Geral

Plataforma digital para associação do Sicoob, contendo website, aplicativo mobile e painel administrativo para gestão de associados e convênios.

**Público-alvo:** Funcionários e associados do Sicoob

---

## Stack Tecnológica Definida

| Camada | Tecnologia |
|--------|------------|
| Frontend Web | Next.js 14 (React) |
| Backend | NestJS (Node.js) |
| Mobile | React Native (Expo) |
| Banco de Dados | PostgreSQL |
| Cache/Sessões | Redis |
| Autenticação | JWT + Refresh Tokens |
| Hospedagem | Vercel (web) + Railway (backend) |

---

## Fases do Projeto

### Fase 1: Foundation (Sprints 1-4)
**Objetivo:** Setup do projeto, arquitetura base, autenticação, infraestrutura

#### Sprint 1: Setup e Infraestrutura ✅
- [x] Configurar repositório Git
- [x] Setup Next.js (frontend)
- [x] Setup NestJS (backend)
- [x] Configurar PostgreSQL e Redis
- [x] Configurar ESLint, Prettier, Husky
- [x] Configurar ambiente de desenvolvimento Docker

#### Sprint 2: Design System e UI Base ✅
- [x] Definir identidade visual (cores verde/white - #0D3A12)
- [x] Criar design system (componentes base: Button, Input, Card)
- [x] Criar layout padrão (header, footer)
- [x] Configurar tema claro/escuro
- [ ] Criar protótipos/wireframes das páginas principais (opcional)

#### Sprint 3: Backend Core e Autenticação ✅
- [x] Configurar Prisma
- [x] Criar entidades base (User, Role, Associated, Admin, Benefit, Favorite)
- [x] Implementar autenticação JWT
- [ ] Implementar refresh tokens
- [x] Implementar recuperação de senha
- [x] Setup de logging e error handling
- [x] Documentar API (Swagger/OpenAPI)

#### Sprint 4: API e Integrações Base ✅
- [x] Configurar axios/interceptors
- [x] Setup de variáveis de ambiente
- [x] Configurar CORS e segurança
- [x] Setup de upload de arquivos (local)
- [x] Configurar email service (Resend)

---

### Fase 2: Website Institucional (Sprints 5-8)
**Objetivo:** Páginas públicas, blog, CMS básico

#### Sprint 5: Páginas Institucionais ✅
- [x] Homepage
- [x] Página Sobre Nós
- [x] Página Contato (com formulário)
- [x] Página FAQ
- [x] Página Seja um Parceiro

#### Sprint 6: Sistema de Convênios (Frontend) ✅
- [x] Listagem de convênios com filtros
- [x] Página detalhe do convênio
- [x] Busca de convênios
- [x] Sistema de favoritos

#### Sprint 7: Blog e Conteúdo ✅
- [x] Listagem de posts
- [x] Página detalhe do post
- [x] Categorias e tags
- [x] Compartilhamento social

#### Sprint 8: CMS Básico ✅
- [x] Painel administrativo para convênios
- [x] Painel administrativo para blog
- [x] Editor de texto rico
- [x] Upload de imagens

---

### Fase 3: Área do Associado (Sprints 9-12)
**Objetivo:** Cadastro, login, perfil do associado

#### Sprint 9: Sistema de Cadastro
- [x] Formulário de inscrição online
- [x] Validação de campos (CPF, email, etc.)
- [x] Confirmação por email
- [x] Upload de documentos

#### Sprint 10: Login e Área Restrita
- [x] Página de login
- [x] Redefinição de senha
- [x] Dashboard do associado
- [ ] Dados do plano/associação

#### Sprint 11: Perfil do Associado
- [x] Visualização de dados cadastrais
- [x] Edição de dados pessoais
- [ ] Upload de foto de perfil
- [x] Alteração de senha

#### Sprint 12: Recursos do Associado
- [x] Extrato de pagamentos
- [x] Carteirinha digital
- [x] Benefícios ativados
- [x] Canal de comunicação

---

### Fase 4: Sistema de Gestão Admin (Sprints 13-17)
**Objetivo:** Painel administrativo completo para diretoria

#### Sprint 13: Gestão de Associados
- [ ] Listagem de associados
- [ ] Filtros e busca
- [ ] Aprovação/recusa de inscrições
- [ ] Justificativa interna
- [ ] Notificações por email

#### Sprint 14: Cadastro e Edição de Associados
- [ ] Visualização completa de dados
- [ ] Edição de dados cadastrais
- [ ] Histórico de ações
- [ ] Notas internas
- [ ] Ativar/desativar associado

#### Sprint 15: Controle de Pagamentos
- [ ] Status de pagamentos (ativo/inativo/atrasado)
- [ ] Lembretes automáticos
- [ ] Relatório de inadimplência
- [ ] Registro de pagamentos

#### Sprint 16: Assembleias e Votações
- [ ] Cadastro de assembleias
- [ ] Candidatos e chapas
- [ ] Sistema de votação
- [ ] Resultados da votação

#### Sprint 17: Relatórios
- [ ] Relatórios demográficos
- [ ] Relatórios comportamentais
- [ ] Status de pagamento
- [ ] Taxas de adesão/desligamento
- [ ] Exportação CSV/Excel

---

### Fase 5: Módulos Extras (Sprints 18-23)
**Objetivo:** Funcionalidades adicionais

#### Sprint 18: Programa de Indicação
- [ ] Sistema de indicações
- [ ] Painel de controle
- [ ] Recompensas/incentivos

#### Sprint 19: Conteúdo Exclusivo
- [ ] Área de membros
- [ ] Artigos exclusivos
- [ ] Webinars
- [ ] Cursos

#### Sprint 20: Fórum/Comunidade
- [ ] Criação de tópicos
- [ ] Respostas e interações
- [ ] Moderação

#### Sprint 21: Eventos
- [ ] Calendário de eventos
- [ ] Inscrição em eventos
- [ ] Notificações

#### Sprint 22: Vitrine Virtual
- [ ] Catálogo de produtos
- [ ] Publicação de anúncios
- [ ] Busca e filtros
- [ ] Controle de responsabilidades

#### Sprint 23: Módulos Opcionais
- [ ] Depoimentos/Histórias
- [ ] Onboarding automatizado
- [ ] Pesquisas/Feedbacks
- [ ] Gamificação (se solicitado)

---

### Fase 6: Aplicativo Mobile (Sprints 24-31)
**Objetivo:** App iOS e Android

#### Sprint 24-25: Setup e Base
- [ ] Setup React Native (Expo)
- [ ] Navegação base
- [ ] Design system mobile
- [ ] Integração com API

#### Sprint 26-27: Autenticação Mobile
- [ ] Login
- [ ] Cadastro
- [ ] Biometria (Face ID/Touch ID)
- [ ] Push notifications

#### Sprint 28-29: Funcionalidades Principais
- [ ] Acesso a convênios
- [ ] Carteirinha digital
- [ ] Área do associado
- [ ] Geolocalização
- [ ] QR Code

#### Sprint 30-31: Funcionalidades Avançadas
- [ ] E-commerce/vitrine
- [ ] Lista de desejos
- [ ] Câmera/galeria
- [ ] Votações
- [ ] Recursos offline

---

### Fase 7: Finalização (Sativas 32-34)
**Objetivo:** Testes, otimização e publicação

#### Sprint 32: Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Testes de performance

#### Sprint 33: Otimização
- [ ] SEO
- [ ] Performance
- [ ] Segurança (LGPD)
- [ ] Acessibilidade (WCAG)

#### Sprint 34: Publicação
- [ ] Deploy produção
- [ ] Publicação App Store
- [ ] Publicação Google Play
- [ ] Documentação técnica
- [ ] Manual do usuário

---

## Próximos Passos

- [x] Aprovar stack tecnológica
- [x] Sprint 1: Setup e Infraestrutura (CONCLUÍDA)
- [x] Sprint 2: Design System e UI Base (CONCLUÍDA)
- [x] Sprint 3: Backend Core e Autenticação (CONCLUÍDA)
- [x] Sprint 4: API e Integrações Base (CONCLUÍDA)
- [x] Sprint 5: Páginas Institucionais (CONCLUÍDA)
- [x] Sprint 6: Sistema de Convênios (CONCLUÍDA)
- [x] Sprint 7: Blog e Conteúdo (CONCLUÍDA)
- [x] Sprint 8: CMS Básico (CONCLUÍDA)
- [ ] FASE 1 e 2: FINALIZADAS ✅

---

## Decisões Tomadas

- **Hospedagem:** Vercel (frontend) + Railway (backend)
- **CMS:** Customizado
- **Gateway de Pagamento:** Mercado Pago
- **Prioridade:** Website primeiro, depois App Mobile

---

## Progresso Total: ~50% do Projeto

| Fase | Progresso |
|------|-----------|
| Fase 1: Foundation | 100% ✅ |
| Fase 2: Website | 100% ✅ |
| Fase 3: Área do Associado | 25% |
| Fase 4: Admin | 0% |
| Fase 5: Módulos Extras | 0% |
| Fase 6: Mobile | 0% |
| Fase 7: Finalização | 0% |
