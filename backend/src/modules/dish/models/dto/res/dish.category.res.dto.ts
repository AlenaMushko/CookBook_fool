import { ApiProperty } from '@nestjs/swagger';

export class DishSubcategoryResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  order: number;
}

export class DishCategoryResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: [DishSubcategoryResDto] })
  subcategories: DishSubcategoryResDto[];
}

export class DishCategoryListResDto {
  @ApiProperty({ type: [DishCategoryResDto] })
  data: DishCategoryResDto[];
}
