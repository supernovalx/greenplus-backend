import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Role } from 'src/common/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ContributionCommentService } from './contribution-comment.service';
import { ContributionFileService } from './contribution-file.service';
import { ContributionService } from './contribution.service';
import { AddContributionFilesDto } from './dto/add-contribution-files.dto';
import { ContributionCommentDto } from './dto/contribution-comment.dto';
import { ContributionCountByFacultyDto } from './dto/contribution-count-by-faculty.dto';
import { ContributionDto } from './dto/contribution.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { DetailedContributionDto } from './dto/detailed-contribution.dto';
import { DownloadContributionsDto } from './dto/download-contribution.dto';
import { FindAllContributionQueryDto } from './dto/find-all-contribution-query.dto';
import { FindAllPublishedContributionQueryDto } from './dto/find-all-published-contribution-query.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { Contribution } from './entities/contribution.entity';

@Controller('contributions')
@ApiTags('Contribution')
export class ContributionController {
  constructor(
    private readonly contributionService: ContributionService,
    private readonly contributionFileService: ContributionFileService,
    private readonly contributionCommentService: ContributionCommentService,
  ) {}

  @Post()
  @Auth(Role.STUDENT)
  @ApiOperation({ summary: 'Create new contribution' })
  @ApiBadRequestResponse({ description: 'Invalid data, closure date is over' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createContributionDto: CreateContributionDto,
    @UploadedFiles() files: any,
    @CurrentUser() user: User,
  ): Promise<ContributionDto> {
    console.log(
      createContributionDto,
      '\n--------------------------------\n',
      files,
      '--------------------------------',
    );

    const contribution: Contribution = await this.contributionService.createNewContribution(
      user,
      createContributionDto,
      files.files,
      files.thumbnail[0],
    );

    return new ContributionDto(contribution);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Find all contributions' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(ContributionDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
    @Query() query: FindAllContributionQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedDto<ContributionDto>> {
    if (user.role === Role.MARKETING_MANAGER) {
      // MARKETING_MANAGER can only view published contributions
      query.isPublished = true;
    }
    if (user.role === Role.MARKETING_CORDINATOR) {
      // MARKETING_CORDINATOR can only view contributions of their faculty
      query.facultyId = user.faculty.id;
    }
    if (user.role === Role.STUDENT) {
      // STUDENT can only view unpublished contributions of themselves
      if (!query.isPublished) {
        query.authorId = user.id;
        query.facultyId = user.faculty.id;
      } else {
        query.isPublished = true;
      }
    }
    // Find all contributions
    const [contributions, count] = await this.contributionService.findAll(
      paginatedQueryDto,
      query,
    );
    const rs: PaginatedDto<ContributionDto> = {
      total: count,
      results: contributions.map(
        (contribution) => new ContributionDto(contribution),
      ),
    };

    return rs;
  }

  @Get('countByFaculty')
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: 'Count number of contributions of each faculty' })
  async countByFaculty(): Promise<ContributionCountByFacultyDto[]> {
    return await this.contributionService.countByFaculty();
  }

  @Get('published')
  @ApiOperation({ summary: 'Find all published contributions' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(ContributionDto)
  async findAllPublished(
    @Query() paginatedQueryDto: PaginatedQueryDto,
    @Query() query: FindAllPublishedContributionQueryDto,
  ): Promise<PaginatedDto<ContributionDto>> {
    // Find all contributions
    const [contributions, count] = await this.contributionService.findAll(
      paginatedQueryDto,
      {
        ...query,
        isPublished: true,
      },
    );
    const rs: PaginatedDto<ContributionDto> = {
      total: count,
      results: contributions.map(
        (contribution) => new ContributionDto(contribution),
      ),
    };

    return rs;
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.MARKETING_CORDINATOR, Role.STUDENT)
  @ApiOperation({ summary: 'Find contribution by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Contribution not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailedContributionDto> {
    const contribution: Contribution = await this.contributionService.findOne(
      id,
    );
    await this.contributionService.increaseView(id);

    return new DetailedContributionDto(contribution);
  }

  @Get('published/:id')
  @ApiOperation({ summary: 'Find published contribution by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Contribution not found' })
  async findPublishedOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailedContributionDto> {
    const contribution: Contribution = await this.contributionService.findOne(
      id,
    );
    await this.contributionService.increaseView(id);

    return new DetailedContributionDto(contribution);
  }

  @Post('published/download')
  @Auth(Role.MARKETING_MANAGER)
  @ApiOperation({ summary: 'Download selected published contributions as ZIP' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async download(
    @Body() downloadContributionsDto: DownloadContributionsDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contributionService.download(
      downloadContributionsDto.contributionIds,
      user,
    );
  }

  @Post(':id/publish')
  @Auth(Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: 'Publish contribution' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Contribution not found' })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contributionService.publish(id, user);
  }

  @Put(':id')
  @Auth(Role.MARKETING_CORDINATOR, Role.STUDENT)
  @ApiOperation({ summary: 'Update contribution' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContributionDto: UpdateContributionDto,
    @CurrentUser() user: User,
  ): Promise<DetailedContributionDto> {
    const contribution: Contribution = await this.contributionService.update(
      id,
      updateContributionDto,
      user,
    );

    return new DetailedContributionDto(contribution);
  }

  @Delete(':id')
  @Auth(Role.MARKETING_CORDINATOR, Role.STUDENT)
  @ApiOperation({ summary: 'Delete contribution' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contributionService.remove(id, user);
  }

  @Post(':id/files')
  @Auth(Role.STUDENT)
  @ApiOperation({ summary: 'Add contribution files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async addContributionFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() addContributionFilesDto: AddContributionFilesDto,
    @UploadedFiles() files: any,
    @CurrentUser() user: User,
  ): Promise<void> {
    console.log(files);
    await this.contributionFileService.addContributionFiles(id, user, files);
  }

  @Delete(':contributionId/files/:fileId')
  @Auth(Role.STUDENT)
  @ApiOperation({ summary: 'Delete contribution file' })
  async deleteFiles(
    @Param('contributionId', ParseIntPipe) contributionId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contributionFileService.deleteContributionFile(
      contributionId,
      user,
      fileId,
    );
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments of contribution' })
  async getComment(
    @Param('id', ParseIntPipe) contributionId: number,
    @CurrentUser() user: User,
  ): Promise<ContributionCommentDto[]> {
    return (await this.contributionCommentService.findAll(contributionId)).map(
      (comment) => new ContributionCommentDto(comment),
    );
  }

  @Post(':id/comments')
  @Auth(Role.MARKETING_CORDINATOR, Role.STUDENT)
  @ApiOperation({ summary: 'Comment on contribution' })
  async comment(
    @Param('id', ParseIntPipe) contributionId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<ContributionCommentDto> {
    return new ContributionCommentDto(
      await this.contributionCommentService.comment(
        createCommentDto,
        contributionId,
        user,
      ),
    );
  }
}
