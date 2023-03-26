import { Module } from '@nestjs/common';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import { CategoriesRepository } from './categories/repositories/categories.repository';
import { ComponentsRepository } from './repositories/components.repository';

@Module({
  providers: [ComponentsService, ComponentsRepository, CategoriesRepository],
  controllers: [ComponentsController],
})
export class ComponentsModule {}
