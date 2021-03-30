import { Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { OrderType } from 'src/common/enums/order-types';
import { ContributionRepository } from '../contribution/contribution.repository';
import { GlobalHelper } from '../helper/global.helper';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { FacultyRepository } from './faculty.repository';

@Injectable()
export class FacultyService {
  constructor(
    private readonly facultyRepository: FacultyRepository,
    private readonly contributionRepository: ContributionRepository,
    private readonly globalHelper: GlobalHelper,
  ) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    // Check name unique
    await this.facultyRepository.ensureNameIsUniqueOrFail(
      createFacultyDto.name,
    );
    // Create new faculty
    const newFaculty: Faculty = await this.facultyRepository.create(
      createFacultyDto,
    );

    return newFaculty;
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query?: string,
    createAtOrderType?: OrderType,
  ): Promise<[Faculty[], number]> {
    return await this.facultyRepository.findAll(
      paginatedQueryDto,
      query,
      createAtOrderType,
    );
  }

  async findOne(id: number): Promise<Faculty> {
    const facultyFind: Faculty = await this.facultyRepository.findOneById(id);

    return facultyFind;
  }

  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    // Check faculty exists
    await this.facultyRepository.findOneById(id);
    // Check name is unique
    if (updateFacultyDto.name) {
      await this.facultyRepository.ensureNameIsUniqueOrFail(
        updateFacultyDto.name,
      );
    }
    // Update faculty
    await this.facultyRepository.updateOne(id, updateFacultyDto);
    // Delete all contribution of change deadline
    if (
      updateFacultyDto.firstClosureDate ||
      updateFacultyDto.secondClosureDate
    ) {
      await this.contributionRepository.deleteByFacultyId(id);
    }
    // Get updated faculty
    const updatedFaculty: Faculty = await this.facultyRepository.findOneById(
      id,
    );

    return updatedFaculty;
  }

  async delete(id: number): Promise<void> {
    // Delete
    await this.facultyRepository.deleteOne(id);
  }
}
