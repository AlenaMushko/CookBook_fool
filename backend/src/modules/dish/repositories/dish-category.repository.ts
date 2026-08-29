import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DishCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllWithSubcategories() {
    return await this.prisma.dishCategory.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        nameEn: true,
        nameUk: true,
        slug: true,
        order: true,
        subcategories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            nameEn: true,
            nameUk: true,
            slug: true,
            order: true,
          },
        },
      },
    });
  }

  public async findById(id: string) {
    return await this.prisma.dishCategory.findUnique({ where: { id } });
  }

  public async findSubcategoryById(id: string) {
    return await this.prisma.dishSubcategory.findUnique({ where: { id } });
  }
}
