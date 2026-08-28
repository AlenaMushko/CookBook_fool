import { Module } from '@nestjs/common';

import { IngredientController } from './ingredient.controller';
import { IngredientRepository } from './repositories/ingredient.repository';
import { IngredientService } from './services/ingredient.service';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService, IngredientRepository],
  exports: [IngredientService, IngredientRepository],
})
export class IngredientModule {}
