import { Injectable } from '@nestjs/common';
import { DishVisibility } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { DishRepository } from '../../dish/repositories/dish.repository';
import {
  AddMenuDishDto,
  CreateMenuDto,
  CreateMenuSectionDto,
  ReorderMenuDishesDto,
  UpdateMenuDto,
  UpdateMenuSectionDto,
} from '../models/menu.dto';
import { MenuRepository } from '../repositories/menu.repository';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly dishRepository: DishRepository,
  ) {}

  public async findAll(userData: IUserData) {
    const menus = await this.menuRepository.findAllByUser(userData.userId);
    return { data: menus };
  }

  public async create(dto: CreateMenuDto, userData: IUserData) {
    const menu = await this.menuRepository.create({
      name: dto.name,
      description: dto.description,
      userId: userData.userId,
    });
    return menu;
  }

  public async findById(id: string, userData: IUserData) {
    const menu = await this.getOwnedMenuOrThrow(id, userData.userId);
    return menu;
  }

  public async update(id: string, dto: UpdateMenuDto, userData: IUserData) {
    await this.getOwnedMenuOrThrow(id, userData.userId);
    return await this.menuRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
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
    return await this.menuRepository.createSection({
      menuId,
      name: dto.name,
      order: dto.order ?? 0,
    });
  }

  public async updateSection(
    menuId: string,
    sectionId: string,
    dto: UpdateMenuSectionDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    const section = await this.menuRepository.findSection(sectionId);
    if (!section || section.menuId !== menuId) {
      throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
    }
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
    const section = await this.menuRepository.findSection(sectionId);
    if (!section || section.menuId !== menuId) {
      throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
    }
    await this.menuRepository.deleteSection(sectionId);
  }

  public async addDish(
    menuId: string,
    dto: AddMenuDishDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.assertDishAccessible(dto.dishId, userData.userId);

    if (dto.sectionId) {
      const section = await this.menuRepository.findSection(dto.sectionId);
      if (!section || section.menuId !== menuId) {
        throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
      }
    }

    return await this.menuRepository.addDish({
      menuId,
      dishId: dto.dishId,
      sectionId: dto.sectionId,
      order: dto.order ?? 0,
    });
  }

  public async removeDish(menuId: string, dishId: string, userData: IUserData) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.menuRepository.removeDish(menuId, dishId);
  }

  public async reorderDishes(
    menuId: string,
    dto: ReorderMenuDishesDto,
    userData: IUserData,
  ) {
    await this.getOwnedMenuOrThrow(menuId, userData.userId);
    await this.menuRepository.reorderDishes(menuId, dto.items);
  }

  private async getOwnedMenuOrThrow(menuId: string, userId: string) {
    const menu = await this.menuRepository.findById(menuId);
    if (!menu) {
      throw new AppException(ErrorCode.MENU_NOT_FOUND, 404);
    }
    if (menu.userId !== userId) {
      throw new AppException(ErrorCode.MENU_FORBIDDEN, 403);
    }
    return menu;
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
