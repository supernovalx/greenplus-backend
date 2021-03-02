import { Faculty } from '../entities/faculty.entity';

export class FacultyDto {
  id: number;

  name: string;

  firstClosureDate: Date;

  secondClosureDate: Date;

  createAt: Date;

  constructor(faculty: Faculty) {
    this.id = faculty.id;
    this.name = faculty.name;
    this.firstClosureDate = faculty.firstClosureDate;
    this.secondClosureDate = faculty.secondClosureDate;
    this.createAt = faculty.createAt;
  }
}
