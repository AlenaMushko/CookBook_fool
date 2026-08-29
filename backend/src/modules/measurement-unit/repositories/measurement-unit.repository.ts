import { Injectable } from '@nestjs/common';
import { MeasurementUnit, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

const measurementUnitListSelect = {
  id: true,
  code: true,
  nameEn: true,
  nameUk: true,
  symbolEn: true,
  symbolUk: true,
  type: true,
  order: true,
} satisfies Prisma.MeasurementUnitSelect;

export type MeasurementUnitListItem = Prisma.MeasurementUnitGetPayload<{
  select: typeof measurementUnitListSelect;
}>;

@Injectable()
export class MeasurementUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllActive(): Promise<MeasurementUnitListItem[]> {
    return await this.prisma.measurementUnit.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: measurementUnitListSelect,
    });
  }

  public async findById(id: string): Promise<MeasurementUnit | null> {
    return await this.prisma.measurementUnit.findUnique({ where: { id } });
  }

  public async findByCode(code: string): Promise<MeasurementUnit | null> {
    return await this.prisma.measurementUnit.findUnique({ where: { code } });
  }
}
