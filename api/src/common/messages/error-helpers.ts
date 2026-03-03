import { ErrorMessages } from './error-messages';

/**
 * Helper para formatar mensagens de erro com parâmetros
 */
export function formatErrorMessage(
  category: keyof typeof ErrorMessages,
  key: string,
  params?: Record<string, string | number>,
): string {
  const message = (ErrorMessages[category] as Record<string, string>)[key] || 'Erro desconhecido.';

  if (!params) return message;

  return Object.entries(params).reduce((msg, [paramKey, value]) => {
    return msg.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
  }, message);
}

/**
 * Cria uma mensagem de erro amigável a partir de erros de validação do class-validator
 */
export function formatValidationErrors(validationErrors: any[]): string[] {
  const messages: string[] = [];

  for (const error of validationErrors) {
    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        messages.push(formatConstraintMessage(message as string));
      }
    }
    if (error.children?.length) {
      messages.push(...formatValidationErrors(error.children));
    }
  }

  return messages;
}

/**
 * Converte mensagens técnicas do class-validator em mensagens amigáveis
 */
function formatConstraintMessage(message: string): string {
  return message
    .replace(/isEmail/g, 'email inválido')
    .replace(/isString/g, 'deve ser um texto')
    .replace(/isNumber/g, 'deve ser um número')
    .replace(/isBoolean/g, 'deve ser verdadeiro ou falso')
    .replace(/isDate/g, 'deve ser uma data válida')
    .replace(/isNotEmpty/g, 'é obrigatório')
    .replace(/minLength/g, 'mínimo de caracteres')
    .replace(/maxLength/g, 'máximo de caracteres')
    .replace(/min/g, 'mínimo')
    .replace(/max/g, 'máximo')
    .replace(/length/g, 'tamanho')
    .replace(/pattern/g, 'formato')
    .replace(/_/g, ' ');
}

/**
 * Retorna mensagem amigável baseada no código de erro Prisma
 */
export function getPrismaErrorMessage(error: any): string {
  if (error.code === 'P2002') {
    // Unique constraint failed
    if (error.meta?.target) {
      const field = error.meta.target[0];
      if (field === 'email') return ErrorMessages.AUTH.EMAIL_ALREADY_EXISTS;
      if (field === 'cpf') return ErrorMessages.ASSOCIATE.CPF_ALREADY_EXISTS;
      if (field === 'cnpj') return ErrorMessages.PARTNER.CNPJ_ALREADY_EXISTS;
      return `O valor para ${field} já está em uso.`;
    }
  }

  if (error.code === 'P2025') {
    // Record to update not found
    return ErrorMessages.SERVER.INTERNAL_ERROR;
  }

  if (error.code === 'P2003') {
    // Foreign key constraint failed
    return 'Referência inválida. O registro relacionado não existe.';
  }

  return ErrorMessages.SERVER.DATABASE_ERROR;
}
