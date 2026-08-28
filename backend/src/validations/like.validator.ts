import { z } from 'zod';

import { registry } from '../docs/openapi';
import { uuidSchema } from './common';

export const CreateLikeSchema = registry.register(
  'CreateLike',
  z.object({
    dishId: uuidSchema,
  }),
);

export const LikeIdParamSchema = registry.register(
  'LikeIdParam',
  z.object({
    dishId: uuidSchema,
  }),
);

export type CreateLikeBody = z.infer<typeof CreateLikeSchema>;
export type LikeIdParam = z.infer<typeof LikeIdParamSchema>;
