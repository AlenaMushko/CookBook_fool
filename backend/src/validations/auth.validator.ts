import { z } from 'zod';

import { registry } from '../docs/openapi';
import { emailSchema, passwordSchema } from './common';

export const RegisterSchema = registry.register(
  'Register',
  z.object({
    firstName: z.string().trim().min(3).max(50),
    lastName: z.string().trim().min(3).max(50).optional(),
    email: emailSchema,
    password: passwordSchema,
    deviceId: z.string().min(1),
  }),
);

export const LoginSchema = registry.register(
  'Login',
  z.object({
    email: emailSchema,
    password: z.string().min(1),
    deviceId: z.string().min(1),
  }),
);

export const RefreshSchema = registry.register(
  'Refresh',
  z.object({}).optional(),
);

export const ForgotPasswordSchema = registry.register(
  'ForgotPassword',
  z.object({
    email: emailSchema,
  }),
);

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type RefreshBody = z.infer<typeof RefreshSchema>;
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;
