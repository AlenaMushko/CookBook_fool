import { Injectable } from '@nestjs/common';
import {
  ContentLocale,
  Menu,
  MenuDish,
  MenuSection,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type MenuWithRelations = Menu & {
  sections: MenuSection[];
  dishes: (MenuDish & {
    dish: {
      id: string;
      locale: ContentLocale;
      titleEn: string | null;
      titleUk: string | null;
    };
  })[];
};

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllByUser(userId: string): Promise<Menu[]> {
    return await this.prisma.menu.findMany({
      where: { userId },
      orderBy: { created: 'desc' },
    });
  }

  public async findById(id: string): Promise<MenuWithRelations | null> {
    return await this.prisma.menu.findUnique({
      where: { id },
      select: {
        id: true,
        created: true,
        updated: true,
        userId: true,
        name: true,
        description: true,
        sections: {
          orderBy: { order: 'asc' },
          select: { id: true, menuId: true, name: true, order: true },
        },
        dishes: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            menuId: true,
            dishId: true,
            sectionId: true,
            order: true,
            dish: {
              select: {
                id: true,
                locale: true,
                titleEn: true,
                titleUk: true,
              },
            },
          },
        },
      },
    });
  }

  public async create(data: Prisma.MenuUncheckedCreateInput): Promise<Menu> {
    return await this.prisma.menu.create({ data });
  }

  public async update(id: string, data: Prisma.MenuUpdateInput): Promise<Menu> {
    return await this.prisma.menu.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({ where: { id } });
  }

  public async createSection(
    data: Prisma.MenuSectionUncheckedCreateInput,
  ): Promise<MenuSection> {
    return await this.prisma.menuSection.create({ data });
  }

  public async updateSection(
    id: string,
    data: Prisma.MenuSectionUpdateInput,
  ): Promise<MenuSection> {
    return await this.prisma.menuSection.update({ where: { id }, data });
  }

  public async deleteSection(id: string): Promise<void> {
    await this.prisma.menuSection.delete({ where: { id } });
  }

  public async findSection(id: string): Promise<MenuSection | null> {
    return await this.prisma.menuSection.findUnique({ where: { id } });
  }

  public async addDish(
    data: Prisma.MenuDishUncheckedCreateInput,
  ): Promise<MenuDish> {
    return await this.prisma.menuDish.create({ data });
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
