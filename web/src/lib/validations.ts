// Utilitários de validação

// Constantes de validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 3,
  MAX_CPF_LENGTH: 14,
  MAX_PHONE_LENGTH: 15,
  STATE_MAX_LENGTH: 2,
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  name: 'Nome deve ter pelo menos 3 caracteres',
  cpf: 'CPF inválido',
  email: 'Email inválido',
  password: 'Senha deve ter pelo menos 6 caracteres',
  confirmPassword: 'As senhas não conferem',
  required: 'Campo obrigatório',
} as const;

/**
 * Valida CPF usando o algoritmo de dígitos verificadores
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }

  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }

  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;

  return digit1 === parseInt(cleaned[9]) && digit2 === parseInt(cleaned[10]);
}

/**
 * Formata CPF com máscara
 */
export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;

  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

/**
 * Formata telefone com máscara
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Remove caracteres não numéricos
 */
export function cleanNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata data para padrão brasileiro
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Capitaliza primeiro nome
 */
export function capitalizeName(name: string): string {
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
