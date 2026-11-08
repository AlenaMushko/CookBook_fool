import { HttpStatus, ParseUUIDPipe } from '@nestjs/common';

import { ErrorCode } from '../constants/error-codes';
import { AppException } from '../expections/app.exception';

export const uuidPipe = new ParseUUIDPipe({
  exceptionFactory: () =>
    new AppException(
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      'Invalid id',
    ),
});
