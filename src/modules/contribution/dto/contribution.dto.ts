import { Contribution } from '../entities/contribution.entity';

export class ContributionDto {
  id: number;

  name: string;

  description: string;

  thumbnail: string;

  isPublished: boolean;

  views: number;

  authorName: string;

  facultyName: string;

  createAt: Date;

  constructor(contribution: Contribution) {
    this.id = contribution.id;
    this.name = contribution.name;
    this.description = contribution.description;
    this.thumbnail = contribution.thumbnail;
    this.isPublished = contribution.isPublished;
    this.views = contribution.views;
    this.authorName = contribution.user.fullName;
    this.facultyName = contribution.faculty.name;
    this.createAt = contribution.createAt;
  }
}
