import { Injectable } from '@nestjs/common';
import { Menu, MenuDish, MenuSection, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type MenuWithRelations = Menu & {
  sections: MenuSection[];
  dishes: (MenuDish & { dish: { id: string; titleEn: string; titleUk: string } })[];
};

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllByUser(userId: string): Promise<Menu[]> {
    return this.prisma.menu.findMany({
      where: { userId },
      orderBy: { created: 'desc' },
    });
  }

  public async findById(id: string): Promise<MenuWithRelations | null> {
    return this.prisma.menu.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: 'asc' } },
        dishes: {
          orderBy: { order: 'asc' },
          include: {
            dish: { select: { id: true, titleEn: true, titleUk: true } },
          },
        },
      },
    });
  }

  public async create(data: Prisma.MenuUncheckedCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  public async update(
    id: string,
    data: Prisma.MenuUpdateInput,
  ): Promise<Menu> {
    return this.prisma.menu.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({ where: { id } });
  }

  public async createSection(
    data: Prisma.MenuSectionUncheckedCreateInput,
  ): Promise<MenuSection> {
    return this.prisma.menuSection.create({ data });
  }

  public async updateSection(
    id: string,
    data: Prisma.MenuSectionUpdateInput,
  ): Promise<MenuSection> {
    return this.prisma.menuSection.update({ where: { id }, data });
  }

  public async deleteSection(id: string): Promise<void> {
    await this.prisma.menuSection.delete({ where: { id } });
  }

  public async findSection(id: string): Promise<MenuSection | null> {
    return this.prisma.menuSection.findUnique({ where: { id } });
  }

  public async addDish(
    data: Prisma.MenuDishUncheckedCreateInput,
  ): Promise<MenuDish> {
    return this.prisma.menuDish.create({ data });
  }

  public async removeDish(menuId: string, dishId: string): Promise<void> {
    await this.prisma.menuDish.deleteMany({ where: { menuId, dishId } });
  }

  public async reorderDishes(
    menuId: string,
    items: Array<{ dishId: string; order: number; sectionId?: string }>,
  ): Promise<void> {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.menuDish.updateMany({
          where: { menuId, dishId: item.dishId },
          data: { order: item.order, sectionId: item.sectionId ?? null },
        }),
      ),
    );
  }
}
