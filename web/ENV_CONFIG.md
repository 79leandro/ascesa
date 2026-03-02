# Configuração de Ambiente - ASCESA

## Como alternar entre Local e Remoto

### Opção 1: Usando Variáveis de Ambiente

**Para desenvolvimento local:**
```bash
# No arquivo web/.env.local ou via terminal
NEXT_PUBLIC_USE_REMOTE_API=false
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Para produção (remoto):**
```bash
# No arquivo web/.env.local ou via terminal
NEXT_PUBLIC_USE_REMOTE_API=true
NEXT_PUBLIC_API_URL=https://ascesa.onrender.com
```

### Opção 2: Arquivos de Ambiente Pré-configurados

O projeto já vem com arquivos separados:

| Arquivo | Uso |
|---------|-----|
| `.env.development` | Desenvolvimento local |
| `.env.production` | Produção (Vercel) |

**Para usar localmente:**
```bash
cp web/.env.development web/.env.local
```

**Para produção:**
```bash
cp web/.env.production web/.env.local
```

### Opção 3: Variável na Vercel

Na dashboard da Vercel, configure:
```
NEXT_PUBLIC_USE_REMOTE_API=true
NEXT_PUBLIC_API_URL=https://ascesa.onrender.com
```

## Variáveis Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `NEXT_PUBLIC_USE_REMOTE_API` | `true` = remoto, `false` = local | `false` |
| `NEXT_PUBLIC_API_URL` | URL da API (sobrescreve automático) | - |
| `NEXT_PUBLIC_SITE_URL` | URL do site | localhost |

## Verificação no Código

Para verificar qual modo está ativo:

```typescript
import { getApiConfig, isLocalApi } from '@/lib/config';

// Verificar modo atual
const config = getApiConfig();
console.log(`Modo: ${config.mode}`);
console.log(`API: ${config.apiUrl}`);

// Ou simplesmente
if (isLocalApi()) {
  console.log('Usando API local');
}
```
