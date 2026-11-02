import { z } from 'zod';

import { registry } from '../docs/openapi';
import { uuidSchema } from './common';

const ingredientObject = z.object({
  ingredientId: uuidSchema,
  quantity: z.number().positive(),
  unitId: uuidSchema,
});

const instructionObject = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1),
  photo: z.string().optional(),
});

export const IngredientSchema = registry.register(
  'Ingredient',
  ingredientObject,
);

export const InstructionSchema = registry.register(
  'Instruction',
  instructionObject,
);

const createDishObject = z.object({
  title: z.string().trim().min(3).max(30),
  image: z.string().optional(),
  description: z.string().trim().min(3).max(1000).or(z.literal('')).optional(),
  preparationTime: z.number().int().positive().optional(),
  difficulty: z.number().int().min(1).max(5),
  categoryId: uuidSchema,
  isConfident: z.boolean(),
  ingredient: z.array(ingredientObject).optional(),
  instructions: z.array(instructionObject).optional(),
});

export const CreateDishSchema = registry.register(
  'CreateDish',
  createDishObject,
);

export const UpdateDishSchema = registry.register(
  'UpdateDish',
  createDishObject.partial().extend({
    id: uuidSchema,
  }),
);

export const DishesListQuerySchema = registry.register(
  'DishesListQuery',
  z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    offset: z.coerce.number().int().min(0).default(0).optional(),
    categoryId: uuidSchema.optional(),
    search: z.string().trim().min(1).optional(),
    my: z.coerce.boolean().optional(),
  }),
);

export const DishIdParamSchema = registry.register(
  'DishIdParam',
  z.object({
    id: uuidSchema,
  }),
);

export type IngredientBody = z.infer<typeof IngredientSchema>;
export type CreateDishBody = z.infer<typeof CreateDishSchema>;
export type UpdateDishBody = z.infer<typeof UpdateDishSchema>;
export type DishesListQuery = z.infer<typeof DishesListQuerySchema>;
export type DishIdParam = z.infer<typeof DishIdParamSchema>;
