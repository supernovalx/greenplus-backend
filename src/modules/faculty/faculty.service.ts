import { Injectable } from '@nestjs/common';
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
    const facultyCreate = await this.facultyRepository.create(createFacultyDto);

    return await this.facultyRepository.save(facultyCreate);
  }

  async findAll(): Promise<Faculty[]> {
    return await this.facultyRepository.find();
  }

  async findOne(id: number): Promise<Faculty | null> {
    let rs: Faculty | null = null;

    const facultyFind = await this.facultyRepository.findOne(id);
    if (!facultyFind) {
      return rs;
    }

    return facultyFind;
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty | null> {
    let rs: Faculty | null = null;
    if (this.globalHelper.checkObjectIsEmpty(updateFacultyDto)) {
      return rs;
    }
    // Check w/e faculty exist
    const facultyFind = await this.findOne(id);
    if (!facultyFind) {
      return rs;
    }
    // Update
    const updateResult = await this.facultyRepository.update(
      id,
      updateFacultyDto,
    );
    if (updateResult.affected != 1) {
      return rs;
    }

    const updatedFaculty = await this.facultyRepository.findOne(id);
    if (!updatedFaculty) {
      return rs;
    }
    rs = updatedFaculty;

    return rs;
  }

  async delete(id: number): Promise<Boolean> {
    let rs = false;
    // Check w/e faculty exist
    const facultyFind = await this.facultyRepository.findOne(id);
    if (!facultyFind) {
      return rs;
    }
    // Delete
    const deletedResult = await this.facultyRepository.delete(facultyFind);
    if (deletedResult.affected != 1) {
      return rs;
    }
    rs = true;

    return rs;
  }
}
