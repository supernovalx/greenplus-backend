import { BaseRepository } from 'src/common/base.repository';
import { EntityRepository, Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';

@EntityRepository(Faculty)
export class FacultyRepository extends BaseRepository<Faculty> {
  constructor() {
    super('Faculty');
  }
}
