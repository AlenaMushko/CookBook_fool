import { ApiProperty } from '@nestjs/swagger';

export class CountryResDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'UA' })
  code: string;

  @ApiProperty({ example: 'Ukraine' })
  nameEn: string;

  @ApiProperty({ example: 'Україна' })
  nameUk: string;

  @ApiProperty({ example: 'https://flagcdn.com/ua.svg' })
  flagSvg: string;

  @ApiProperty()
  flagAlt: string;
}

export class CountryListResDto {
  @ApiProperty({ type: [CountryResDto] })
  data: CountryResDto[];
}
