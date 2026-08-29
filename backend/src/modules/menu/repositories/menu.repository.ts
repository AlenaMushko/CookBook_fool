import { Injectable } from '@nestjs/common';
import { MenuDish, MenuSection, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

const menuListSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  order: true,
} as const;

const menuDetailSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  order: true,
  sections: {
    orderBy: { order: 'asc' as const },
    select: { id: true, menuId: true, name: true, order: true },
  },
  dishes: {
    orderBy: { order: 'asc' as const },
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
          visibility: true,
        },
      },
    },
  },
} as const;

export type MenuListItem = {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  order: number;
};

export type MenuWithRelations = MenuListItem & {
  sections: Array<{
    id: string;
    menuId: string;
    name: string;
    order: number;
  }>;
  dishes: Array<{
    id: string;
    menuId: string;
    dishId: string;
    sectionId: string | null;
    order: number;
    dish: {
      id: string;
      locale: string;
      titleEn: string | null;
      titleUk: string | null;
      visibility: string;
    };
  }>;
};

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllByOwner(ownerId: string): Promise<MenuListItem[]> {
    return await this.prisma.menu.findMany({
      where: { ownerId },
      orderBy: [{ order: 'asc' }, { created: 'desc' }],
      select: menuListSelect,
    });
  }

  public async findById(id: string): Promise<MenuWithRelations | null> {
    return await this.prisma.menu.findUnique({
      where: { id },
      select: menuDetailSelect,
    });
  }

  public async getNextMenuOrder(ownerId: string): Promise<number> {
    const last = await this.prisma.menu.findFirst({
      where: { ownerId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return (last?.order ?? -1) + 1;
  }

  public async create(
    data: Prisma.MenuUncheckedCreateInput,
  ): Promise<MenuListItem> {
    return await this.prisma.menu.create({
      data,
      select: menuListSelect,
    });
  }

  public async update(
    id: string,
    data: Prisma.MenuUpdateInput,
  ): Promise<MenuListItem> {
    return await this.prisma.menu.update({
      where: { id },
      data,
      select: menuListSelect,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({ where: { id } });
  }

  public async getNextSectionOrder(menuId: string): Promise<number> {
    const last = await this.prisma.menuSection.findFirst({
      where: { menuId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return (last?.order ?? -1) + 1;
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

  public async findDishInMenu(
    menuId: string,
    dishId: string,
  ): Promise<MenuDish | null> {
    return await this.prisma.menuDish.findUnique({
      where: { menuId_dishId: { menuId, dishId } },
    });
  }

  public async getNextDishOrder(
    menuId: string,
    sectionId: string | null,
  ): Promise<number> {
    const last = await this.prisma.menuDish.findFirst({
      where: { menuId, sectionId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return (last?.order ?? -1) + 1;
  }

  public async addDishes(
    data: Array<Prisma.MenuDishUncheckedCreateInput>,
  ): Promise<MenuDish[]> {
    return await this.prisma.$transaction(
      data.map((row) => this.prisma.menuDish.create({ data: row })),
    );
  }

  public async removeDish(menuId: string, dishId: string): Promise<void> {
    await this.prisma.menuDish.deleteMany({ where: { menuId, dishId } });
  }

  public async updateDish(
    menuId: string,
    dishId: string,
    data: { sectionId?: string | null; order?: number },
  ): Promise<MenuDish | null> {
    const existing = await this.findDishInMenu(menuId, dishId);
    if (!existing) {
      return null;
    }

    return await this.prisma.menuDish.update({
      where: { id: existing.id },
      data: {
        ...(data.sectionId !== undefined && { sectionId: data.sectionId }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  }
}
