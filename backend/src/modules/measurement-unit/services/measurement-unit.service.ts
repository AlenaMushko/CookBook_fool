import { Injectable } from '@nestjs/common';
import { MeasurementUnit } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { MeasurementUnitListResDto } from '../models/measurement-unit.dto';
import { MeasurementUnitRepository } from '../repositories/measurement-unit.repository';

@Injectable()
export class MeasurementUnitService {
  constructor(
    private readonly measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  public async findAll(): Promise<MeasurementUnitListResDto> {
    const units = await this.measurementUnitRepository.findAllActive();
    return { data: units };
  }

  public async findByIdOrThrow(id: string): Promise<MeasurementUnit> {
    const unit = await this.measurementUnitRepository.findById(id);
    if (!unit) {
      throw new AppException(ErrorCode.UNIT_NOT_FOUND, 404);
    }
    return unit;
  }
}
