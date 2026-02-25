import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        return throwError(
          () =>
            new HttpException(
              {
                success: false,
                message: err.message || 'Erro interno do servidor',
                statusCode: status,
              },
              status,
            ),
        );
      }),
    );
  }
}
