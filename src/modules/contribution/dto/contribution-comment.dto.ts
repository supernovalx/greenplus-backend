import { ContributionComment } from '../entities/contribution-comment.entity';

export class ContributionCommentDto {
  id: number;

  comment: string;

  authorName: string;

  authorId: number;

  isDeleted: boolean;

  createAt: Date;

  updateAt: Date;

  constructor(comment: ContributionComment) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.authorId = comment.userId;
    this.isDeleted = comment.isDeleted;
    this.createAt = comment.createAt;
    this.updateAt = comment.updateAt;
    if (comment.user) {
      this.authorName = comment.user.fullName;
    }
  }
}
