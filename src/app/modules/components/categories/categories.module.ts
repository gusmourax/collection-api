import { Module } from '@nestjs/common';
import { DatabaseModule } from 'app/database/database.module';
import { CategoriesRepository } from './repositories/categories.repository';

@Module({
  imports: [DatabaseModule],
  providers: [CategoriesRepository],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
