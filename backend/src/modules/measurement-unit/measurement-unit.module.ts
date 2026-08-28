import { Module } from '@nestjs/common';

import { MeasurementUnitController } from './measurement-unit.controller';
import { MeasurementUnitRepository } from './repositories/measurement-unit.repository';
import { MeasurementUnitService } from './services/measurement-unit.service';

@Module({
  controllers: [MeasurementUnitController],
  providers: [MeasurementUnitService, MeasurementUnitRepository],
  exports: [MeasurementUnitService, MeasurementUnitRepository],
})
export class MeasurementUnitModule {}
