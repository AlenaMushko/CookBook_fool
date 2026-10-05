import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { apiPath, ApiRoute } from '../../common/constants/api-route.enum';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { MeasurementUnitListResDto } from './models/measurement-unit.dto';
import { MeasurementUnitService } from './services/measurement-unit.service';

@ApiTags('Measurement Units')
@Controller(apiPath(ApiRoute.MEASUREMENT_UNITS))
export class MeasurementUnitController {
  constructor(
    private readonly measurementUnitService: MeasurementUnitService,
  ) {}

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'List active measurement units' })
  public async findAll(): Promise<MeasurementUnitListResDto> {
    return await this.measurementUnitService.findAll();
  }
}
