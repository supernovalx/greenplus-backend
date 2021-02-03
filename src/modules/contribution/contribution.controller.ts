import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Role } from 'src/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { ContributionService } from './contribution.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/comment.dto copy';
import { ContributionDto } from './dto/contribution.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { DetailedContributionDto } from './dto/detailed-contribution.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Controller('contributions')
@ApiTags('Contribution')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  @Auth(Role.STUDENT)
  @ApiOperation({ summary: '*WIP* Create new contribution' })
  @ApiBadRequestResponse({ description: 'Invalid data, closure date is over' })
  async create(
    @Body() createContributionDto: CreateContributionDto,
  ): Promise<ContributionDto> {
    // @ts-ignore
    return this.contributionService.create(createContributionDto);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: '*WIP* Find all contributions' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(ContributionDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedDto<ContributionDto>> {
    // @ts-ignore
    return this.contributionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '*WIP* Find contribution by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Contribution not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailedContributionDto> {
    // @ts-ignore
    return this.contributionService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '*WIP* Update contribution' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContributionDto: UpdateContributionDto,
  ): Promise<DetailedContributionDto> {
    // @ts-ignore
    return this.contributionService.update(+id, updateContributionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '*WIP* Delete contribution' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // @ts-ignore
    return this.contributionService.remove(+id);
  }

  @Put(':id/files')
  @ApiOperation({ summary: '*WIP* Add contribution files' })
  async updateFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContributionDto: UpdateContributionDto,
  ): Promise<DetailedContributionDto> {
    // @ts-ignore
    return this.contributionService.update(+id, updateContributionDto);
  }

  @Delete(':id/files')
  @ApiOperation({ summary: '*WIP* Delete contribution files' })
  async deleteFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContributionDto: UpdateContributionDto,
  ): Promise<DetailedContributionDto> {
    // @ts-ignore
    return this.contributionService.update(+id, updateContributionDto);
  }

  @Post(':id/comments')
  @Auth()
  @ApiOperation({ summary: '*WIP* Comment on contribution' })
  async comment(
    @Param('id', ParseIntPipe) id: number,
    @Query() createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    // @ts-ignore
    return;
  }

  @Put(':contributionId/comments/:commentId')
  @Auth()
  @ApiOperation({ summary: '*WIP* Update comment' })
  async updateComment(
    @Param('contributionId', ParseIntPipe) contributionId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    // @ts-ignore
    return;
  }

  @Delete(':contributionId/comments/:commentId')
  @Auth()
  @ApiOperation({ summary: '*WIP* Delete comment' })
  async deleteComment(
    @Param('contributionId', ParseIntPipe) contributionId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<CommentDto> {
    // @ts-ignore
    return;
  }
}
