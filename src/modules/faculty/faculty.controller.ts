import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FacultyDto } from './dto/faculty.dto';
import { Auth } from '../auth/auth.decorator';
import { Role } from 'src/enums/roles';
import { GlobalHelper } from '../helper/global.helper';
import { Faculty } from './entities/faculty.entity';

@Controller('faculty')
@ApiTags('Faculty')
export class FacultyController {
  constructor(
    private facultyService: FacultyService,
    private globalHelper: GlobalHelper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new faculty' })
  async create(
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<FacultyDto> {
    const faculty = await this.facultyService.create(createFacultyDto);

    return new FacultyDto(faculty);
  }

  @Get()
  @ApiOperation({ summary: 'Find all faculties' })
  @Auth(Role.ADMIN)
  async findAll(): Promise<FacultyDto[]> {
    const faculties = await this.facultyService.findAll();

    return faculties.map((faculty) => new FacultyDto(faculty));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find faculty by id' })
  @Auth(Role.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FacultyDto> {
    const facultyFind = await this.facultyService.findOne(id);
    if (facultyFind === null) {
      throw new NotFoundException();
    }

    return new FacultyDto(facultyFind);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update faculty' })
  @Auth(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<FacultyDto> {
    if (this.globalHelper.checkObjectIsEmpty(updateFacultyDto)) {
      throw new BadRequestException();
    }

    const updatedFaculty = await this.facultyService.update(
      id,
      updateFacultyDto,
    );
    if (updatedFaculty === null) {
      throw new BadRequestException();
    }

    return new FacultyDto(updatedFaculty);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete faculty' })
  @Auth(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deletedFaculty = await this.facultyService.delete(+id);
    if (deletedFaculty === null) {
      throw new BadRequestException();
    }
  }
}
