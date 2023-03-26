import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './app/modules/auth/auth.module';
import { ComponentsModule } from './app/modules/components/components.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ComponentsModule],
})
export class AppModule {}
