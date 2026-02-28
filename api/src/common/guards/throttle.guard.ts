import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class ThrottlerGuard implements CanActivate {
  private store: RateLimitStore = {};
  private readonly limit: number = 100; // requests
  private readonly ttl: number = 60000; // 1 minute

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const key = `${ip}:${request.route?.path || request.url}`;

    const now = Date.now();

    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.ttl,
      };
      return true;
    }

    this.store[key].count++;

    if (this.store[key].count > this.limit) {
      throw new HttpException(
        'Muitas requisições. Tente novamente mais tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
