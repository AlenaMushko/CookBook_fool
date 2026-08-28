import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
    return this.ingredientService.search(query.search, query.limit);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create ingredient' })
  public async create(
    @Body() dto: CreateIngredientDto,
  ): Promise<IngredientResDto> {
    return this.ingredientService.create(dto);
  }
}
