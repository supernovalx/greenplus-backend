import { forwardRef, Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyRepository } from './faculty.repository';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacultyRepository]),
    forwardRef(() => ContributionModule),
  ],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [TypeOrmModule],
})
export class FacultyModule {}
