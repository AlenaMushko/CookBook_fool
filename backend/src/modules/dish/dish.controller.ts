import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AUTH_COOKIE_NAMES } from '../auth/constants/constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateDishDto } from './models/dto/req/create-dish.dto';
import { DishesListReqDto } from './models/dto/req/dishes-list.req.dto';
import { UpdateDishDto } from './models/dto/req/update-dish.req.dto';
import { DishCategoryListResDto } from './models/dto/res/dish.category.res.dto';
import {
  DishListResDto,
  ParsedDishResDto,
} from './models/dto/res/dish.res.dto';
import { DishCategoryService } from './services/dish.category.service';
import { DishService } from './services/dish.service';

@ApiTags('Dish')
@Controller('dish')
export class DishController {
  constructor(
    private readonly dishCategoryService: DishCategoryService,
    private readonly dishService: DishService,
  ) {}

  @SkipAuth()
  @Get('categories')
  @ApiOperation({ summary: 'List dish categories with subcategories' })
  public async getDishCategories(): Promise<DishCategoryListResDto> {
    return await this.dishCategoryService.getDishCategories();
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Post()
  @ApiOperation({ summary: 'Create dish' })
  public async createDish(
    @Body() dto: CreateDishDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ParsedDishResDto> {
    return await this.dishService.createDish(dto, userData);
  }

  @OptionalAuth()
  @Get()
  @ApiOperation({ summary: 'List dishes' })
  public async getAllDishes(
    @Query() query: DishesListReqDto,
    @CurrentUser() userData?: IUserData,
  ): Promise<DishListResDto> {
    return await this.dishService.getAllDishes(query, userData);
  }

  @OptionalAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get dish by id' })
  public async getDishById(
    @Param('id') id: string,
    @CurrentUser() userData?: IUserData,
  ): Promise<ParsedDishResDto> {
    return await this.dishService.getDishById(id, userData);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update dish' })
  public async updateDish(
    @Param('id') id: string,
    @Body() dto: UpdateDishDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ParsedDishResDto> {
    return await this.dishService.updateDish(id, dto, userData);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete dish' })
  public async deleteDish(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.dishService.deleteDish(id, userData);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Post(':id/like')
  @ApiOperation({ summary: 'Save dish to cookbook' })
  public async saveDish(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.dishService.saveDish(id, userData);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Delete(':id/like')
  @ApiOperation({ summary: 'Unsave dish from cookbook' })
  public async unsaveDish(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.dishService.unsaveDish(id, userData);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Create my version of dish' })
  public async duplicateDish(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ): Promise<ParsedDishResDto> {
    return await this.dishService.duplicateDish(id, userData);
  }
}
