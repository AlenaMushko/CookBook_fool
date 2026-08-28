import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import {
  AddMenuDishDto,
  CreateMenuDto,
  CreateMenuSectionDto,
  ReorderMenuDishesDto,
  UpdateMenuDto,
  UpdateMenuSectionDto,
} from './models/menu.dto';
import { MenuService } from './services/menu.service';

@ApiBearerAuth()
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'List user menus' })
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
  @ApiOperation({ summary: 'Create menu section' })
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
  @ApiOperation({ summary: 'Add dish to menu' })
  public async addDish(
    @Param('id') id: string,
    @Body() dto: AddMenuDishDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.addDish(id, dto, userData);
  }

  @Delete(':id/dishes/:dishId')
  @ApiOperation({ summary: 'Remove dish from menu' })
  public async removeDish(
    @Param('id') id: string,
    @Param('dishId') dishId: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.removeDish(id, dishId, userData);
  }

  @Patch(':id/dishes/reorder')
  @ApiOperation({ summary: 'Reorder menu dishes' })
  public async reorderDishes(
    @Param('id') id: string,
    @Body() dto: ReorderMenuDishesDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.menuService.reorderDishes(id, dto, userData);
  }
}
