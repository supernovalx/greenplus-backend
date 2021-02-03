import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyRepository } from './faculty.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyRepository])],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [TypeOrmModule],
})
export class FacultyModule {}
