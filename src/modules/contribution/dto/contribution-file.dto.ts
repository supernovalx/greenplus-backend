import { ContributionFile } from '../entities/contribution-file.entity';

export class ContributionFileDto {
  id: number;

  file: string;

  createAt: Date;

  constructor(file: ContributionFile) {
    this.id = file.id;
    this.file = file.file;
    this.createAt = file.createAt;
  }
}
