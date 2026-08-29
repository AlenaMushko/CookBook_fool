import { Injectable } from '@nestjs/common';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import {
  CreateIngredientDto,
  IngredientListResDto,
  IngredientResDto,
} from '../models/ingredient.dto';
import { IngredientRepository } from '../repositories/ingredient.repository';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  public async search(
    search: string | undefined,
    limit = 20,
  ): Promise<IngredientListResDto> {
    const cappedLimit = Math.min(Math.max(limit, 1), 50);

    if (!search?.trim()) {
      return { data: [] };
    }

    const ingredients = await this.ingredientRepository.search(
      search.trim(),
      cappedLimit,
    );

    return { data: ingredients };
  }

  public async create(dto: CreateIngredientDto): Promise<IngredientResDto> {
    const existing = await this.ingredientRepository.findByNormalizedName(
      dto.nameEn,
      dto.nameUk,
    );

    if (existing) {
      throw new AppException(
        ErrorCode.INGREDIENT_ALREADY_EXISTS,
        409,
        'Ingredient already exists',
      );
    }

    return await this.ingredientRepository.create({
      en: { name: dto.nameEn.trim() },
      uk: { name: dto.nameUk.trim() },
    });
  }

  public async findByIdOrThrow(id: string) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new AppException(ErrorCode.INGREDIENT_NOT_FOUND, 404);
    }
    return ingredient;
  }
}
