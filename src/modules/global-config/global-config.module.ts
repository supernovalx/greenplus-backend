import { Module } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfigController } from './global-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfigRepository } from './global-config.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalConfigRepository])],
  controllers: [GlobalConfigController],
  providers: [GlobalConfigService],
  exports: [TypeOrmModule],
})
export class GlobalConfigModule {}
