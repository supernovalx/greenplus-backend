import { Module } from '@nestjs/common';
import { ContributionModule } from '../contribution/contribution.module';
import { FacultyModule } from '../faculty/faculty.module';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';

@Module({
  imports: [FacultyModule, ContributionModule, UserModule],
  controllers: [ReportController],
})
export class ReportModule {}
