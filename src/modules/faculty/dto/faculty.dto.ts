import { Faculty } from '../entities/faculty.entity';

export class FacultyDto {
  id: number;

  name: string;

  description?: string;

  createAt: Date;

  constructor(faculty: Faculty) {
    this.id = faculty.id;
    this.name = faculty.name;
    this.description = faculty.description;
    this.createAt = faculty.createAt;
  }
}
