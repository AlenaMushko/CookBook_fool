import { z } from 'zod';

import { registry } from '../docs/openapi';
import { uuidSchema } from './common';

const ingredientObject = z.object({
  ingredientName: z.string().trim().min(1).max(50),
  measure: z.string().trim().min(1).max(50),
});

export const IngredientSchema = registry.register(
  'Ingredient',
  ingredientObject,
);

const createDishObject = z.object({
  isConfident: z.boolean(),
  title: z.string().trim().min(3).max(30),
  subtitle: z.string().trim().min(3).max(200).optional(),
  image: z.string().optional(),
  description: z.string().trim().min(3).max(1000),
  note: z.string().trim().min(5).max(200).optional(),
  preparationTime: z.number().int().positive().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  ingredient: z.array(ingredientObject).min(1),
  categoryId: uuidSchema,
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
