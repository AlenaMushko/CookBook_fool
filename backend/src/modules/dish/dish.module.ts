import { forwardRef, Module } from '@nestjs/common';

import { IngredientModule } from '../ingredient/ingredient.module';
import { MeasurementUnitModule } from '../measurement-unit/measurement-unit.module';
import { S3Module } from '../s3/s3.module';
import { DishController } from './dish.controller';
import { CountryRepository } from './repositories/country.repository';
import { DishRepository } from './repositories/dish.repository';
import { DishCategoryRepository } from './repositories/dish-category.repository';
import { LikeRepository } from './repositories/like.repository';
import { CountryService } from './services/country.service';
import { DishCategoryService } from './services/dish.category.service';
import { DishService } from './services/dish.service';

@Module({
  imports: [
    IngredientModule,
    MeasurementUnitModule,
    forwardRef(() => S3Module),
  ],
  controllers: [DishController],
  providers: [
    DishService,
    DishCategoryService,
    CountryService,
    DishRepository,
    DishCategoryRepository,
    CountryRepository,
    LikeRepository,
  ],
  exports: [DishService, LikeRepository, DishRepository],
})
export class DishModule {}
