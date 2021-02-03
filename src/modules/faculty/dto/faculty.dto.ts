import { Faculty } from '../entities/faculty.entity';

export class FacultyDto {
  id: number;

  name: string;

  createAt: Date;

  constructor(faculty: Faculty) {
    this.id = faculty.id;
    this.name = faculty.name;
    this.createAt = faculty.createAt;
  }
}
