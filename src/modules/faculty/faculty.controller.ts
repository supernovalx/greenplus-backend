import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacultyDto } from './dto/faculty.dto';
import { PaginatedDto } from 'src/modules/faculty/dto/paginated.dto';

@Controller('faculty')
@ApiTags('Faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new faculty' })
  async create(
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all faculties' })
  async findAll(): Promise<PaginatedDto<FacultyDto[]>> {
    // @ts-ignore
    return this.facultyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find faculty by id' })
  async findOne(@Param('id') id: string): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update faculty' })
  async update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    // @ts-ignore
    return this.facultyService.update(+id, updateFacultyDto);
  }
}
