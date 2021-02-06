import { Injectable, NotImplementedException } from '@nestjs/common';
import { GlobalHelper } from '../helper/global.helper';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { FacultyRepository } from './faculty.repository';

@Injectable()
export class FacultyService {
  constructor(
    private readonly facultyRepository: FacultyRepository,
    private readonly globalHelper: GlobalHelper,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const newFaculty = await this.facultyRepository.create(createFacultyDto);

    return newFaculty;
  }

  async findAll(): Promise<Faculty[]> {
    throw new NotImplementedException();
  }

  async findOne(id: number): Promise<Faculty> {
    const facultyFind = await this.facultyRepository.findOneById(id);

    return facultyFind;
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    // Update faculty
    await this.facultyRepository.updateOne(id, updateFacultyDto);
    // Get updated faculty
    const updatedFaculty = await this.facultyRepository.findOneById(id);

    return updatedFaculty;
  }

  async delete(id: number): Promise<void> {
    // Delete
    await this.facultyRepository.deleteOne(id);
  }
}
