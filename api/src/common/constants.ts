// Constantes da aplicação

// Configurações de autenticação
export const AUTH_CONSTANTS = {
  BCRYPT_ROUNDS: 10,
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  PASSWORD_RESET_EXPIRY_HOURS: 1,
} as const;

// Configurações de upload
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'application/pdf'] as string[],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'] as string[],
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Status de usuário
export const USER_STATUS = {
  PENDENTE: 'PENDENTE',
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  SUSPENSO: 'SUSPENSO',
} as const;

// Tipos de role
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DIRETOR: 'DIRETOR',
  ASSOCIADO: 'ASSOCIADO',
} as const;

// Tipos de documento
export const DOCUMENT_TYPES = {
  CPF: 'CPF',
  RG: 'RG',
  COMPROVANTE_RESIDENCIA: 'COMPROVANTE_RESIDENCIA',
  FOTO: 'FOTO',
  OUTRO: 'OUTRO',
} as const;

// Status de documento
export const DOCUMENT_STATUS = {
  PENDENTE: 'PENDENTE',
  APROVADO: 'APROVADO',
  REJEITADO: 'REJEITADO',
} as const;
