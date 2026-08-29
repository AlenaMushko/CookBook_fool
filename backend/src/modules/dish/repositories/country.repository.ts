import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

const countryListSelect = {
  id: true,
  code: true,
  nameEn: true,
  nameUk: true,
  flagSvg: true,
  flagAlt: true,
} as const;

export type CountryListItem = {
  id: string;
  code: string;
  nameEn: string;
  nameUk: string;
  flagSvg: string;
  flagAlt: string;
};

@Injectable()
export class CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<CountryListItem[]> {
    return await this.prisma.country.findMany({
      orderBy: { nameEn: 'asc' },
      select: countryListSelect,
    });
  }

  public async findById(id: string): Promise<CountryListItem | null> {
    return await this.prisma.country.findUnique({
      where: { id },
      select: countryListSelect,
    });
  }
}
