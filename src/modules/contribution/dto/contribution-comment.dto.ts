import { ContributionComment } from '../entities/contribution-comment.entity';

export class ContributionCommentDto {
  id: number;

  comment: string;

  authorName: string;

  isDeleted: boolean;

  createAt: Date;

  updateAt: Date;

  constructor(comment: ContributionComment) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.isDeleted = comment.isDeleted;
    this.createAt = comment.createAt;
    this.updateAt = comment.updateAt;
  }
}
