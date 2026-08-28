import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { MeasurementUnitListResDto } from './models/measurement-unit.dto';
import { MeasurementUnitService } from './services/measurement-unit.service';

@ApiTags('Measurement Units')
@Controller('measurement-units')
export class MeasurementUnitController {
  constructor(
    private readonly measurementUnitService: MeasurementUnitService,
  ) {}

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'List active measurement units' })
  public async findAll(): Promise<MeasurementUnitListResDto> {
    return this.measurementUnitService.findAll();
  }
}
