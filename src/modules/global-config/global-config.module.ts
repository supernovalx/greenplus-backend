import { forwardRef, Module } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfigController } from './global-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfigRepository } from './global-config.repository';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalConfigRepository]),
    forwardRef(() => ContributionModule),
  ],
  controllers: [GlobalConfigController],
  providers: [GlobalConfigService],
  exports: [TypeOrmModule, GlobalConfigService],
})
export class GlobalConfigModule {}
