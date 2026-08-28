import { z } from 'zod';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .regex(EMAIL_REGEX, 'Invalid email format')
  .max(300);

export const uuidSchema = z.string().uuid('Invalid UUID');
