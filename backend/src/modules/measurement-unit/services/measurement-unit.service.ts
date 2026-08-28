import { Injectable } from '@nestjs/common';
import { MeasurementUnit } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/exceptions/app.exception';
import { MeasurementUnitListResDto } from '../models/measurement-unit.dto';
import { MeasurementUnitRepository } from '../repositories/measurement-unit.repository';

@Injectable()
export class MeasurementUnitService {
  constructor(
    private readonly measurementUnitRepository: MeasurementUnitRepository,
  ) {}

  public async findAll(): Promise<MeasurementUnitListResDto> {
    const units = await this.measurementUnitRepository.findAllActive();
    return { data: units.map((u) => this.toResDto(u)) };
  }

  public async findByIdOrThrow(id: string): Promise<MeasurementUnit> {
    const unit = await this.measurementUnitRepository.findById(id);
    if (!unit) {
      throw new AppException(ErrorCode.UNIT_NOT_FOUND, 404);
    }
    return unit;
  }

  private toResDto(unit: MeasurementUnit) {
    return {
      id: unit.id,
      code: unit.code,
      nameEn: unit.nameEn,
      nameUk: unit.nameUk,
      symbolEn: unit.symbolEn ?? undefined,
      symbolUk: unit.symbolUk ?? undefined,
      type: unit.type,
      order: unit.order,
    };
  }
}
