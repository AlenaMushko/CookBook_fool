import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AUTH_COOKIE_NAMES } from '../auth/constants/constants';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import {
  CreateIngredientDto,
  IngredientListResDto,
  IngredientResDto,
  IngredientSearchQueryDto,
} from './models/ingredient.dto';
import { IngredientService } from './services/ingredient.service';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'Search ingredients (autocomplete)' })
  public async search(
    @Query() query: IngredientSearchQueryDto,
  ): Promise<IngredientListResDto> {
    return await this.ingredientService.search(query.search, query.limit);
  }

  @ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
  @Post()
  @ApiOperation({ summary: 'Create ingredient' })
  public async create(
    @Body() dto: CreateIngredientDto,
  ): Promise<IngredientResDto> {
    return await this.ingredientService.create(dto);
  }
}
