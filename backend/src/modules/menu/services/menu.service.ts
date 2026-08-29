import { Injectable } from '@nestjs/common';
import { DishVisibility } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { DishRepository } from '../../dish/repositories/dish.repository';
import { DishService } from '../../dish/services/dish.service';
import {
  AddMenuDishesDto,
  CreateMenuDto,
  CreateMenuSectionDto,
  UpdateMenuDishDto,
  UpdateMenuDto,
  UpdateMenuSectionDto,
} from '../models/menu.dto';
import { MenuRepository } from '../repositories/menu.repository';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly dishRepository: DishRepository,
    private readonly dishService: DishService,
  ) {}

  public async findAll(userData: IUserData) {
    const menus = await this.menuRepository.findAllByOwner(userData.userId);
    return { data: menus };
  }

  public async create(dto: CreateMenuDto, userData: IUserData) {
    const order =
      dto.order ??
      (await this.menuRepository.getNextMenuOrder(userData.userId));

    return await this.menuRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId: userData.userId,
      order,
    });
  }

  public async findById(id: string, userData: IUserData) {
    return await this.getOwnedMenuOrThrow(id, userData.userId);
  }

  public async update(id: string, dto: UpdateMenuDto, userData: IUserData) {
    await this.getOwnedMenuOrThrow(id, userData.userId);
    return await this.menuRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.order !== undefined && { order: dto.order }),
    });
  }

  public async delete(id: string, userData: IUserData) {
    await this.getOwnedMenuOrThrow(id, userData.userId);
    await this.menuRepository.delete(id);
  }

  public async createSection(
    menuId: string,
    dto: CreateMenuSectionDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    const order =
      dto.order ?? (await this.menuRepository.getNextSectionOrder(menuId));

    return await this.menuRepository.createSection({
      menuId,
      name: dto.name,
      order,
    });
  }

  public async updateSection(
    menuId: string,
    sectionId: string,
    dto: UpdateMenuSectionDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.assertSectionInMenu(menuId, sectionId);
    return await this.menuRepository.updateSection(sectionId, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.order !== undefined && { order: dto.order }),
    });
  }

  public async deleteSection(
    menuId: string,
    sectionId: string,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.assertSectionInMenu(menuId, sectionId);
    await this.menuRepository.deleteSection(sectionId);
  }

  public async addDishes(
    menuId: string,
    dto: AddMenuDishesDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);

    const sectionId = dto.sectionId ?? null;
    if (sectionId) {
      await this.assertSectionInMenu(menuId, sectionId);
    }

    const hasDishIds = Boolean(dto.dishIds?.length);
    if (!hasDishIds && !dto.dish) {
      throw new AppException(
        ErrorCode.VALIDATION_ERROR,
        422,
        'Provide dishIds and/or dish',
      );
    }

    const dishIdsToAdd: string[] = [];

    if (hasDishIds) {
      const uniqueExisting = [...new Set(dto.dishIds)];
      for (const dishId of uniqueExisting) {
        await this.assertDishAccessible(dishId, userData.userId);

        const existing = await this.menuRepository.findDishInMenu(
          menuId,
          dishId,
        );
        if (existing) {
          throw new AppException(
            ErrorCode.MENU_DISH_ALREADY_ADDED,
            409,
            'Dish is already in this menu',
          );
        }

        dishIdsToAdd.push(dishId);
      }
    }

    if (dto.dish) {
      const createdDish = await this.dishService.createDish(
        {
          ...dto.dish,
          visibility: dto.dish.visibility ?? DishVisibility.PRIVATE,
        },
        userData,
      );
      dishIdsToAdd.push(createdDish.id);
    }

    let nextOrder = await this.menuRepository.getNextDishOrder(
      menuId,
      sectionId,
    );

    const created = await this.menuRepository.addDishes(
      dishIdsToAdd.map((dishId) => ({
        menuId,
        dishId,
        sectionId,
        order: nextOrder++,
      })),
    );

    return { data: created };
  }

  public async removeDish(menuId: string, dishId: string, userData: IUserData) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.menuRepository.removeDish(menuId, dishId);
  }

  public async updateDish(
    menuId: string,
    dishId: string,
    dto: UpdateMenuDishDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);

    if (dto.sectionId) {
      await this.assertSectionInMenu(menuId, dto.sectionId);
    }

    const updated = await this.menuRepository.updateDish(menuId, dishId, {
      ...(dto.sectionId !== undefined && { sectionId: dto.sectionId }),
      ...(dto.order !== undefined && { order: dto.order }),
    });

    if (!updated) {
      throw new AppException(ErrorCode.MENU_DISH_NOT_FOUND, 404);
    }

    return updated;
  }

  private async getOwnedMenuOrThrow(menuId: string, ownerId: string) {
    const menu = await this.menuRepository.findById(menuId);
    if (!menu) {
      throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
    }
    if (menu.ownerId !== ownerId) {
      throw new AppException(ErrorCode.MENU_FORBIDDEN, 403);
    }
    return menu;
  }

  private async assertSectionInMenu(menuId: string, sectionId: string) {
    const section = await this.menuRepository.findSection(sectionId);
    if (!section || section.menuId !== menuId) {
      throw new AppException(ErrorCode.MENU_SECTION_NOT_FOUND, 404);
    }
  }

  private async assertDishAccessible(dishId: string, userId: string) {
    const dish = await this.dishRepository.findDishById(dishId);
    if (!dish) {
      throw new AppException(ErrorCode.DISH_NOT_FOUND, 404);
    }
    if (dish.visibility === DishVisibility.PRIVATE && dish.ownerId !== userId) {
      throw new AppException(ErrorCode.DISH_PRIVATE, 404);
    }
  }
}
