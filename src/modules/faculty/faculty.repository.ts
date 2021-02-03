import { EntityRepository, Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';

@EntityRepository(Faculty)
export class FacultyRepository extends Repository<Faculty> {}
