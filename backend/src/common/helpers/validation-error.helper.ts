import { ValidationError } from 'class-validator';

import { ErrorCode } from '../constants/error-codes';

export type FieldValidationError = {
  field: string;
  code: string;
  message: string;
};

function mapConstraintToCode(constraint: string): string {
  switch (constraint) {
    case 'isNotEmpty':
    case 'isDefined':
      return 'REQUIRED';
    case 'min':
      return 'MIN';
    case 'max':
      return 'MAX';
    case 'isUuid':
      return 'INVALID_UUID';
    case 'isEmail':
      return 'INVALID_EMAIL';
    case 'isEnum':
      return 'INVALID_ENUM';
    case 'isInt':
    case 'isNumber':
      return 'INVALID_NUMBER';
    default:
      return 'INVALID';
  }
}

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): FieldValidationError[] {
  const result: FieldValidationError[] = [];

  for (const error of errors) {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      const [constraint, message] = Object.entries(error.constraints)[0];
      result.push({
        field,
        code: mapConstraintToCode(constraint),
        message,
      });
    }

    if (error.children?.length) {
      result.push(...flattenValidationErrors(error.children, field));
    }
  }

  return result;
}

export function formatValidationErrors(errors: ValidationError[]): {
  statusCode: 422;
  code: ErrorCode.VALIDATION_ERROR;
  errors: FieldValidationError[];
} {
  return {
    statusCode: 422,
    code: ErrorCode.VALIDATION_ERROR,
    errors: flattenValidationErrors(errors),
  };
}
