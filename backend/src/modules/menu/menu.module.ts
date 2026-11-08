import { Module } from '@nestjs/common';

import { DishModule } from '../dish/dish.module';
import { S3Module } from '../s3/s3.module';
import { MenuController } from './menu.controller';
import { MenuRepository } from './repositories/menu.repository';
import { MenuService } from './services/menu.service';
import { ShoppingListService } from './shopping/shopping-list.service';

@Module({
  imports: [DishModule, S3Module],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository, ShoppingListService],
})
export class MenuModule {}
