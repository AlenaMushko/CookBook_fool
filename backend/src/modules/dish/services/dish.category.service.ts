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

    return {
      data: categories.map((cat) => ({
        id: cat.id,
        nameEn: cat.nameEn,
        nameUk: cat.nameUk,
        slug: cat.slug,
        order: cat.order,
        subcategories: cat.subcategories.map((sub) => ({
          id: sub.id,
          nameEn: sub.nameEn,
          nameUk: sub.nameUk,
          slug: sub.slug,
          order: sub.order,
        })),
      })),
    };
  }
}
