import { Module } from '@nestjs/common';

import { IngredientModule } from '../ingredient/ingredient.module';
import { MeasurementUnitModule } from '../measurement-unit/measurement-unit.module';
import { ConversionController } from './conversion.controller';
import { ConversionRepository } from './repositories/conversion.repository';
import { ConversionService } from './services/conversion.service';

@Module({
  imports: [IngredientModule, MeasurementUnitModule],
  controllers: [ConversionController],
  providers: [ConversionService, ConversionRepository],
})
export class ConversionModule {}
