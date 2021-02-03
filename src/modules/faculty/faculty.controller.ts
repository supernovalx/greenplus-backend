import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FacultyDto } from './dto/faculty.dto';
import { UpdateClosureDatesDto } from './dto/update-closure-dates.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { ClosureDatesDto } from './dto/closure-dates.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Role } from 'src/enums/roles';

@Controller('faculty')
@ApiTags('Faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Create new faculty' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.create(createFacultyDto);
  }

  @Post('/closure-dates')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Change global closure dates' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async changeGlobalClosureDates(
    @Body() updateClosureDatesDto: UpdateClosureDatesDto,
  ): Promise<ClosureDatesDto> {
    // @ts-ignore
    return this.facultyService.create(createFacultyDto);
  }

  @Post(':id/closure-dates')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: "*WIP* Change faculty's closure dates" })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async changeFacultyClosureDates(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClosureDatesDto: UpdateClosureDatesDto,
  ): Promise<ClosureDatesDto> {
    // @ts-ignore
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: '*WIP* Find all faculties' })
  @ApiPaginatedResponse(FacultyDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedDto<FacultyDto>> {
    // @ts-ignore
    return this.facultyService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Find faculty by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.findOne(+id);
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Update faculty' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.update(+id, updateFacultyDto);
  }
}
