import { z } from 'zod';

import { registry } from '../docs/openapi';
import { emailSchema, passwordSchema, PHONE_REGEX, uuidSchema } from './common';

export const CreateUserSchema = registry.register(
  'CreateUser',
  z.object({
    firstName: z.string().trim().min(3).max(50),
    lastName: z.string().trim().min(3).max(50).optional(),
    email: emailSchema,
    password: passwordSchema,
    image: z.string().max(3000).optional(),
    phone: z
      .string()
      .regex(
        PHONE_REGEX,
        'Phone number must be in E.164 format (e.g., +123456789)',
      )
      .optional(),
  }),
);

export const UpdateUserSchema = registry.register(
  'UpdateUser',
  z.object({
    id: uuidSchema,
    firstName: z.string().trim().min(3).max(50).optional(),
    lastName: z.string().trim().min(3).max(50).optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    image: z.string().max(3000).optional().nullable(),
    phone: z
      .string()
      .regex(
        PHONE_REGEX,
        'Phone number must be in E.164 format (e.g., +123456789)',
      )
      .optional()
      .nullable(),
  }),
);

export const UserIdParamSchema = registry.register(
  'UserIdParam',
  z.object({
    id: uuidSchema,
  }),
);

export type CreateUserBody = z.infer<typeof CreateUserSchema>;
export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;
export type UserIdParam = z.infer<typeof UserIdParamSchema>;
