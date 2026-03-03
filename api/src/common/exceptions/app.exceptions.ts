import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../messages/error-messages';

/**
 * Exceção para erros de validação com mensagens amigáveis
 */
export class ValidationException extends HttpException {
  constructor(message: string | string[]) {
    const messages = Array.isArray(message) ? message : [message];
    super(
      {
        success: false,
        message: messages[0],
        errors: messages,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Exceção para recurso não encontrado
 */
export class NotFoundException extends HttpException {
  constructor(resource: string = 'Recurso') {
    super(
      {
        success: false,
        message: `${resource} não encontrado.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Exceção para operação não autorizada
 */
export class UnauthorizedException extends HttpException {
  constructor(message: string = ErrorMessages.AUTH.UNAUTHORIZED) {
    super(
      {
        success: false,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Exceção para acesso proibido
 */
export class ForbiddenException extends HttpException {
  constructor(message: string = ErrorMessages.AUTH.FORBIDDEN) {
    super(
      {
        success: false,
        message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Exceção para conflito de dados
 */
export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        success: false,
        message,
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Exceção para erro de negócio
 */
export class BusinessException extends HttpException {
  constructor(message: string) {
    super(
      {
        success: false,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
