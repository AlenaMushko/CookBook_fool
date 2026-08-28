import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import logger from '../../logger';
import { ErrorCode } from '../constants/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let body: Record<string, unknown>;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'code' in exceptionResponse
      ) {
        body = { ...(exceptionResponse as Record<string, unknown>) };
      } else {
        const messages =
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null &&
          'message' in exceptionResponse
            ? (exceptionResponse as { message: string | string[] }).message
            : exception.message;

        body = {
          statusCode: status,
          code:
            status === HttpStatus.UNAUTHORIZED
              ? ErrorCode.AUTH_TOKEN_EXPIRED
              : undefined,
          message: Array.isArray(messages) ? messages.join(', ') : messages,
        };
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = {
        statusCode: status,
        message: 'Internal server error',
      };
    }

    const shouldLog =
      !this.isProduction || status >= HttpStatus.INTERNAL_SERVER_ERROR;

    if (shouldLog) {
      logger.error(
        {
          err: exception,
          method: request.method,
          url: request.url,
          statusCode: status,
        },
        'Request failed',
      );
    }

    response.status(status).json(body);
  }
}
