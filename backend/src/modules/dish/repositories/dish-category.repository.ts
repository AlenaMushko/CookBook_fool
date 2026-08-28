import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DishCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllWithSubcategories() {
    return this.prisma.dishCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        subcategories: { orderBy: { order: 'asc' } },
      },
    });
  }

  public async findById(id: string) {
    return this.prisma.dishCategory.findUnique({ where: { id } });
  }

  public async findSubcategoryById(id: string) {
    return this.prisma.dishSubcategory.findUnique({ where: { id } });
  }
}
