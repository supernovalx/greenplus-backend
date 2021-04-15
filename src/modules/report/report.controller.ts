import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { ContributionRepository } from '../contribution/contribution.repository';
import { FacultyRepository } from '../faculty/faculty.repository';
import { UserRepository } from '../user/user.repository';
import { SiteStatisticsDto } from './dto/site-statistics.dto';

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(
    private userRepository: UserRepository,
    private facultyRepository: FacultyRepository,
    private contributionRepository: ContributionRepository,
  ) {}

  @Get()
  @Auth(Role.MARKETING_MANAGER)
  @ApiOperation({ summary: 'Get site statistics' })
  async getSiteStatistics(): Promise<SiteStatisticsDto> {
    const rs: SiteStatisticsDto = new SiteStatisticsDto();
    const [
      totalUser,
      totalFaculty,
      submittedStudents,
      submittedFaculties,
      largestPublishedCountOfSingleFaculty,
      newSubmissionsIn7Days,
    ] = await Promise.all([
      this.userRepository.countTotalStudent(),
      this.facultyRepository.countTotal(),
      this.contributionRepository.countNumberOfDistinctStudents(),
      this.contributionRepository.countNumberOfDistinctFaculty(),
      this.contributionRepository.largestPublishedCountOfSingleFaculty(),
      this.contributionRepository.newSubmissionsIn7Days(),
    ]);
    //
    // console.log(
    //   totalUser,
    //   totalFaculty,
    //   submittedStudents,
    //   submittedFaculties,
    //   largestPublishedCountOfSingleFaculty,
    //   newSubmissionsIn7Days,
    // );
    rs.largestSubmissionCountOfSingleFaculty = largestPublishedCountOfSingleFaculty;
    rs.newSubmissionsIn7Days = newSubmissionsIn7Days;
    rs.percentOfStudentHasSubmitted = (submittedStudents / totalUser) * 100.0;
    rs.percentOfFacultyHasSubmitted =
      (submittedFaculties / totalFaculty) * 100.0;

    return rs;
  }
}
