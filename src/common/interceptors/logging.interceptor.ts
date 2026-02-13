import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    this.logger.log(
      `➡️  [${method}] ${url} - IP: ${ip} - UserAgent: ${userAgent.substring(0, 50)}`,
    );

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          const statusCode = context.switchToHttp().getResponse().statusCode;

          this.logger.log(
            `✅ [${method}] ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
          );

          // Optional: Log response data in development
          if (process.env.NODE_ENV !== 'production' && response) {
            const responsePreview = JSON.stringify(response).substring(0, 200);
            this.logger.debug(`Response preview: ${responsePreview}`);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(
            `❌ [${method}] ${url} - Status: ${statusCode} - Error: ${error.message} - Duration: ${duration}ms`,
          );

          // Log stack trace in development
          if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(error.stack);
          }
        },
      }),
    );
  }
}
