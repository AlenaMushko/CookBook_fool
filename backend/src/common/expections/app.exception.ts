import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../constants/error-codes';

export class AppException extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    status: HttpStatus,
    message?: string,
  ) {
    super({ statusCode: status, code, message: message ?? code }, status);
  }
}
