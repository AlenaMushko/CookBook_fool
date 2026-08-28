import { SetMetadata } from '@nestjs/common';

export const OPTIONAL_AUTH = 'optionalAuth';
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH, true);
