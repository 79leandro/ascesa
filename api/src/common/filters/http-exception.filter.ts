import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorMessages } from '../messages/error-messages';
import { formatValidationErrors, getPrismaErrorMessage } from '../messages/error-helpers';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ErrorMessages.SERVER.INTERNAL_ERROR;
    let errors: any = undefined;

    // Erros HTTP (inclui validation errors do class-validator)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;

        // Erros de validação do class-validator
        if (resp.message && Array.isArray(resp.message)) {
          const formattedMessages = formatValidationErrors(resp.message);
          message = formattedMessages[0] || ErrorMessages.VALIDATION.REQUIRED_FIELD;
          errors = formattedMessages;
        } else if (resp.message && typeof resp.message === 'string') {
          message = this.makeUserFriendly(resp.message);
        } else {
          message = exception.message;
        }

        errors = resp.errors || errors;
      } else {
        message = this.makeUserFriendly(exceptionResponse as string);
      }
    }
    // Erros do Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      message = getPrismaErrorMessage(exception);
      status = HttpStatus.BAD_REQUEST;
      this.logError(request, exception);
    }
    // Erros do Prisma - Query engine
    else if (exception instanceof Prisma.PrismaClientInitializationError) {
      message = ErrorMessages.SERVER.DATABASE_ERROR;
      status = HttpStatus.SERVICE_UNAVAILABLE;
      this.logError(request, exception);
    }
    // Outros erros
    else if (exception instanceof Error) {
      message = this.makeUserFriendly(exception.message);

      // Não expor detalhes de erros em produção
      if (process.env.NODE_ENV === 'development') {
        this.logger.error(
          `${request.method} ${request.url} - ${exception.message}`,
          exception.stack,
        );
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      errors: errors?.length ? errors : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Em desenvolvimento, incluir stack trace
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Converte mensagens técnicas em mensagens amigáveis
   */
  private makeUserFriendly(message: string): string {
    // Credenciais inválidas
    if (message.includes('invalid credentials') || message.includes('Unauthorized')) {
      return ErrorMessages.AUTH.INVALID_CREDENTIALS;
    }

    // Token inválido
    if (message.includes('jwt') || message.includes('token')) {
      return ErrorMessages.AUTH.INVALID_TOKEN;
    }

    // Erro de banco de dados
    if (message.includes('database') || message.includes('prisma')) {
      return ErrorMessages.SERVER.DATABASE_ERROR;
    }

    // Erro de conexão
    if (message.includes('connect') || message.includes('ECONNREFUSED')) {
      return ErrorMessages.SERVER.EXTERNAL_SERVICE_ERROR;
    }

    // Retorna a mensagem original se não houver mapeamento
    return message;
  }

  private logError(request: Request, error: any) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.error(
        `${request.method} ${request.url} - ${error.message}`,
        error.stack,
      );
    } else {
      this.logger.error(`${request.method} ${request.url} - ${error.code}`);
    }
  }
}
