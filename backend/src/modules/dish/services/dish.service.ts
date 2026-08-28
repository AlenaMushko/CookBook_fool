import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DishVisibility, Prisma } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { extractDishMediaKeys } from '../../../common/helpers/dish-media.helper';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { IngredientService } from '../../ingredient/services/ingredient.service';
import { MeasurementUnitService } from '../../measurement-unit/services/measurement-unit.service';
import { S3Service } from '../../s3/services/s3.service';
import { CreateDishDto } from '../models/dto/req/create-dish.dto';
import {
  DishesListReqDto,
  DishListScope,
} from '../models/dto/req/dishes-list.req.dto';
import { UpdateDishDto } from '../models/dto/req/update-dish.req.dto';
import {
  DishListResDto,
  ParsedDishResDto,
} from '../models/dto/res/dish.res.dto';
import { DishRepository } from '../repositories/dish.repository';
import { DishCategoryRepository } from '../repositories/dish-category.repository';
import { LikeRepository } from '../repositories/like.repository';
import { DishMapper } from './dish.mapper';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly dishCategoryRepository: DishCategoryRepository,
    private readonly likeRepository: LikeRepository,
    private readonly ingredientService: IngredientService,
    private readonly measurementUnitService: MeasurementUnitService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  public async createDish(
    dto: CreateDishDto,
    userData: IUserData,
  ): Promise<ParsedDishResDto> {
    await this.validateCategoryAndSubcategory(
      dto.categoryId,
      dto.subcategoryId,
    );
    await this.validateIngredients(dto.ingredients);

    const dish = await this.dishRepository.createWithRelations(
      {
        titleEn: dto.titleEn,
        titleUk: dto.titleUk,
        descriptionEn: dto.descriptionEn,
        descriptionUk: dto.descriptionUk,
        noteEn: dto.noteEn,
        noteUk: dto.noteUk,
        visibility: dto.visibility,
        difficulty: dto.difficulty,
        prepTime: dto.prepTime,
        cookTime: dto.cookTime,
        baseServings: dto.baseServings,
        steps: dto.steps as unknown as Prisma.InputJsonValue,
        photos: (dto.photos ?? []) as unknown as Prisma.InputJsonValue,
        ownerId: userData.userId,
        categoryId: dto.categoryId,
        subcategoryId: dto.subcategoryId,
      },
      (dto.ingredientGroups ?? []).map((g) => ({
        tempId: g.tempId,
        nameEn: g.nameEn,
        nameUk: g.nameUk,
        order: g.order,
      })),
      dto.ingredients,
    );

    return DishMapper.toParsedResponseDto(dish, {
      userId: userData.userId,
      isSaved: false,
    });
  }

  public async updateDish(
    id: string,
    dto: UpdateDishDto,
    userData: IUserData,
  ): Promise<ParsedDishResDto> {
    const existing = await this.findOwnedOrThrow(id, userData.userId);

    if (dto.categoryId || dto.subcategoryId) {
      await this.validateCategoryAndSubcategory(
        dto.categoryId ?? existing.categoryId,
        dto.subcategoryId ?? existing.subcategoryId ?? undefined,
      );
    }

    if (dto.ingredients) {
      await this.validateIngredients(dto.ingredients);
    }

    const dishData: Prisma.DishUncheckedUpdateInput = {
      ...(dto.titleEn !== undefined && { titleEn: dto.titleEn }),
      ...(dto.titleUk !== undefined && { titleUk: dto.titleUk }),
      ...(dto.descriptionEn !== undefined && {
        descriptionEn: dto.descriptionEn,
      }),
      ...(dto.descriptionUk !== undefined && {
        descriptionUk: dto.descriptionUk,
      }),
      ...(dto.noteEn !== undefined && { noteEn: dto.noteEn }),
      ...(dto.noteUk !== undefined && { noteUk: dto.noteUk }),
      ...(dto.visibility !== undefined && { visibility: dto.visibility }),
      ...(dto.difficulty !== undefined && { difficulty: dto.difficulty }),
      ...(dto.prepTime !== undefined && { prepTime: dto.prepTime }),
      ...(dto.cookTime !== undefined && { cookTime: dto.cookTime }),
      ...(dto.baseServings !== undefined && { baseServings: dto.baseServings }),
      ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      ...(dto.subcategoryId !== undefined && {
        subcategoryId: dto.subcategoryId,
      }),
      ...(dto.steps !== undefined && {
        steps: dto.steps as unknown as Prisma.InputJsonValue,
      }),
      ...(dto.photos !== undefined && {
        photos: dto.photos as unknown as Prisma.InputJsonValue,
      }),
    };

    const dish = await this.dishRepository.updateWithRelations(
      id,
      dishData,
      dto.ingredients
        ? (dto.ingredientGroups ?? []).map((g) => ({
            tempId: g.tempId,
            nameEn: g.nameEn,
            nameUk: g.nameUk,
            order: g.order,
          }))
        : undefined,
      dto.ingredients,
    );

    const isSaved = await this.likeRepository.isSaved(userData.userId, id);
    return DishMapper.toParsedResponseDto(dish, {
      userId: userData.userId,
      isSaved,
    });
  }

  public async getAllDishes(
    query: DishesListReqDto,
    userData?: IUserData,
  ): Promise<DishListResDto> {
    const userId = userData?.userId;

    if (query.scope && query.scope !== DishListScope.PUBLIC && !userId) {
      throw new UnauthorizedException();
    }

    const savedDishIds = userId
      ? await this.likeRepository.getSavedDishIds(userId)
      : [];

    const [entities, total] = await this.dishRepository.getList(
      query,
      userId,
      savedDishIds,
    );

    const savedSet = new Set(savedDishIds);
    return DishMapper.toListResponseDto(
      entities,
      total,
      query,
      savedSet,
      userId,
    );
  }

  public async getDishById(
    id: string,
    userData?: IUserData,
  ): Promise<ParsedDishResDto> {
    const dish = await this.dishRepository.findDishById(id);
    if (!dish) {
      throw new AppException(ErrorCode.DISH_NOT_FOUND, 404);
    }

    const userId = userData?.userId;
    const isOwner = userId === dish.ownerId;

    if (dish.visibility === DishVisibility.PRIVATE && !isOwner) {
      throw new AppException(ErrorCode.DISH_PRIVATE, 404);
    }

    const isSaved = userId
      ? await this.likeRepository.isSaved(userId, id)
      : undefined;

    return DishMapper.toParsedResponseDto(dish, { userId, isSaved });
  }

  public async deleteDish(id: string, userData: IUserData): Promise<void> {
    const dish = await this.findOwnedOrThrow(id, userData.userId);
    const mediaKeys = extractDishMediaKeys(dish.steps, dish.photos);

    await this.dishRepository.deleteDishById(id);

    if (mediaKeys.length > 0) {
      await this.s3Service.deleteKeysBestEffort(mediaKeys);
    }
  }

  public async saveDish(id: string, userData: IUserData): Promise<void> {
    const dish = await this.dishRepository.findDishById(id);
    if (!dish) {
      throw new AppException(ErrorCode.DISH_NOT_FOUND, 404);
    }

    if (dish.ownerId === userData.userId) {
      throw new AppException(ErrorCode.CANNOT_SAVE_OWN_DISH, 400);
    }

    if (dish.visibility !== DishVisibility.PUBLIC) {
      throw new AppException(ErrorCode.DISH_PRIVATE, 404);
    }

    const existing = await this.likeRepository.findByUserAndDish(
      userData.userId,
      id,
    );
    if (!existing) {
      await this.likeRepository.create(userData.userId, id);
    }
  }

  public async unsaveDish(id: string, userData: IUserData): Promise<void> {
    await this.likeRepository.delete(userData.userId, id);
  }

  public async duplicateDish(
    id: string,
    userData: IUserData,
  ): Promise<ParsedDishResDto> {
    const source = await this.dishRepository.findDishById(id);
    if (!source) {
      throw new AppException(ErrorCode.DISH_NOT_FOUND, 404);
    }

    if (
      source.visibility === DishVisibility.PRIVATE &&
      source.ownerId !== userData.userId
    ) {
      throw new AppException(ErrorCode.DISH_PRIVATE, 404);
    }

    const dish = await this.dishRepository.duplicateDish(
      source,
      userData.userId,
    );

    return DishMapper.toParsedResponseDto(dish, {
      userId: userData.userId,
      isSaved: false,
    });
  }

  public async isDishOwnedByUser(
    dishId: string,
    userId: string,
  ): Promise<boolean> {
    const dish = await this.dishRepository.findDishById(dishId);
    return dish?.ownerId === userId;
  }

  private async findOwnedOrThrow(id: string, userId: string) {
    const dish = await this.dishRepository.findDishById(id);
    if (!dish) {
      throw new AppException(ErrorCode.DISH_NOT_FOUND, 404);
    }
    if (dish.ownerId !== userId) {
      throw new AppException(ErrorCode.DISH_FORBIDDEN, 403);
    }
    return dish;
  }

  private async validateCategoryAndSubcategory(
    categoryId: string,
    subcategoryId?: string,
  ): Promise<void> {
    const category = await this.dishCategoryRepository.findById(categoryId);
    if (!category) {
      throw new AppException(ErrorCode.CATEGORY_NOT_FOUND, 404);
    }

    if (!subcategoryId) return;

    const subcategory =
      await this.dishCategoryRepository.findSubcategoryById(subcategoryId);
    if (!subcategory) {
      throw new AppException(ErrorCode.SUBCATEGORY_NOT_FOUND, 404);
    }

    if (subcategory.categoryId !== categoryId) {
      throw new AppException(ErrorCode.SUBCATEGORY_CATEGORY_MISMATCH, 422);
    }
  }

  private async validateIngredients(
    ingredients: Array<{ ingredientId: string; unitId: string }>,
  ): Promise<void> {
    await Promise.all(
      ingredients.map(async (ing) => {
        await this.ingredientService.findByIdOrThrow(ing.ingredientId);
        await this.measurementUnitService.findByIdOrThrow(ing.unitId);
      }),
    );
  }
}
