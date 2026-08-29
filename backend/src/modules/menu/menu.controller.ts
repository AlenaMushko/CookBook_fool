import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AUTH_COOKIE_NAMES } from '../auth/constants/constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import {
  AddMenuDishesDto,
  CreateMenuDto,
  CreateMenuSectionDto,
  UpdateMenuDishDto,
  UpdateMenuDto,
  UpdateMenuSectionDto,
} from './models/menu.dto';
import { MenuService } from './services/menu.service';

@ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'List my menus' })
  public async findAll(@CurrentUser() userData: IUserData) {
    return await this.menuService.findAll(userData);
  }

  @Post()
  @ApiOperation({ summary: 'Create menu' })
  public async create(
    @Body() dto: CreateMenuDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.create(dto, userData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu detail' })
  public async findById(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.findById(id, userData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu' })
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.update(id, dto, userData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu' })
  public async delete(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.delete(id, userData);
  }

  @Post(':id/sections')
  @ApiOperation({ summary: 'Create optional menu section' })
  public async createSection(
    @Param('id') id: string,
    @Body() dto: CreateMenuSectionDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.createSection(id, dto, userData);
  }

  @Patch(':id/sections/:sectionId')
  @ApiOperation({ summary: 'Update menu section' })
  public async updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateMenuSectionDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.updateSection(id, sectionId, dto, userData);
  }

  @Delete(':id/sections/:sectionId')
  @ApiOperation({ summary: 'Delete menu section' })
  public async deleteSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.deleteSection(id, sectionId, userData);
  }

  @Post(':id/dishes')
  @ApiOperation({
    summary:
      'Add dishes to menu: existing dishIds and/or create dish, optional section',
  })
  public async addDishes(
    @Param('id') id: string,
    @Body() dto: AddMenuDishesDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.addDishes(id, dto, userData);
  }

  @Patch(':id/dishes/:dishId')
  @ApiOperation({ summary: 'Update menu dish (section / order)' })
  public async updateDish(
    @Param('id') id: string,
    @Param('dishId') dishId: string,
    @Body() dto: UpdateMenuDishDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.updateDish(id, dishId, dto, userData);
  }

  @Delete(':id/dishes/:dishId')
  @ApiOperation({ summary: 'Remove dish from menu (does not delete recipe)' })
  public async removeDish(
    @Param('id') id: string,
    @Param('dishId') dishId: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.removeDish(id, dishId, userData);
  }
}
