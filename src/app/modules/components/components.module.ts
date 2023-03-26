import { Module } from '@nestjs/common';
import { DatabaseModule } from 'app/database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import { ComponentsRepository } from './repositories/components.repository';

@Module({
  imports: [CategoriesModule, DatabaseModule],
  providers: [ComponentsService, ComponentsRepository],
  controllers: [ComponentsController],
})
export class ComponentsModule {}
