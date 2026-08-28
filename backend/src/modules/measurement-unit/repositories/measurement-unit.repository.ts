import { Injectable } from '@nestjs/common';
import { MeasurementUnit } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MeasurementUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllActive(): Promise<MeasurementUnit[]> {
    return await this.prisma.measurementUnit.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  public async findById(id: string): Promise<MeasurementUnit | null> {
    return await this.prisma.measurementUnit.findUnique({ where: { id } });
  }

  public async findByCode(code: string): Promise<MeasurementUnit | null> {
    return await this.prisma.measurementUnit.findUnique({ where: { code } });
  }
}
