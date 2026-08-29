import { Injectable } from '@nestjs/common';

import { DishCategoryListResDto } from '../models/dto/res/dish.category.res.dto';
import { DishCategoryRepository } from '../repositories/dish-category.repository';

@Injectable()
export class DishCategoryService {
  constructor(
    private readonly dishCategoryRepository: DishCategoryRepository,
  ) {}

  public async getDishCategories(): Promise<DishCategoryListResDto> {
    const categories =
      await this.dishCategoryRepository.findAllWithSubcategories();

    return { data: categories };
  }
}
