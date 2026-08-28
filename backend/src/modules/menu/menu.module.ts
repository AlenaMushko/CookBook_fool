import { Module } from '@nestjs/common';

import { DishModule } from '../dish/dish.module';
import { MenuController } from './menu.controller';
import { MenuRepository } from './repositories/menu.repository';
import { MenuService } from './services/menu.service';

@Module({
  imports: [DishModule],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
})
export class MenuModule {}
