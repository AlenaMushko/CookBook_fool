import { ApiProperty } from '@nestjs/swagger';

export class MeasurementUnitResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty({ required: false })
  symbolEn?: string;

  @ApiProperty({ required: false })
  symbolUk?: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  order: number;
}

export class MeasurementUnitListResDto {
  @ApiProperty({ type: [MeasurementUnitResDto] })
  data: MeasurementUnitResDto[];
}
