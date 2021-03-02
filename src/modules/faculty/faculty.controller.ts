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
import { Role } from 'src/common/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { GlobalHelper } from '../helper/global.helper';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { FacultyDto } from './dto/faculty.dto';
import { FindAllFacultyQueryDto } from './dto/find-all-faculty-query.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { FacultyService } from './faculty.service';

@Controller('faculty')
@ApiTags('Faculty')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly globalHelper: GlobalHelper,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Create new faculty' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<FacultyDto> {
    const faculty: Faculty = await this.facultyService.create(createFacultyDto);

    return new FacultyDto(faculty);
  }

  @Get()
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: 'Find all faculties' })
  @ApiPaginatedResponse(FacultyDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
    @Query() findAllQueryDto: FindAllFacultyQueryDto,
  ): Promise<PaginatedDto<FacultyDto>> {
    // Find all faculties
    const [faculties, count] = await this.facultyService.findAll(
      paginatedQueryDto,
      findAllQueryDto.query,
      findAllQueryDto.createAtOrderType,
    );
    const rs: PaginatedDto<FacultyDto> = {
      total: count,
      results: faculties.map((faculty) => new FacultyDto(faculty)),
    };

    return rs;
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Find faculty by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FacultyDto> {
    const facultyFind: Faculty = await this.facultyService.findOne(id);

    return new FacultyDto(facultyFind);
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update faculty' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    const updatedFaculty: Faculty = await this.facultyService.update(
      id,
      updateFacultyDto,
    );

    return new FacultyDto(updatedFaculty);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete faculty' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.facultyService.delete(id);
  }
}
