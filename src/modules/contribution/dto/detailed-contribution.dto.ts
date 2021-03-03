import { ContributionComment } from '../entities/contribution-comment.entity';
import { ContributionFile } from '../entities/contribution-file.entity';
import { Contribution } from '../entities/contribution.entity';
import { ContributionCommentDto } from './contribution-comment.dto';
import { ContributionFileDto } from './contribution-file.dto';
import { ContributionDto } from './contribution.dto';

export class DetailedContributionDto extends ContributionDto {
  comments: ContributionCommentDto[] = [];

  files: ContributionFileDto[] = [];

  constructor(contribution: Contribution) {
    super(contribution);
    if (contribution.comments) {
      this.comments = contribution.comments.map(
        (comment: ContributionComment) => new ContributionCommentDto(comment),
      );
    }
    if (contribution.files) {
      this.files = contribution.files.map(
        (file: ContributionFile) => new ContributionFileDto(file),
      );
    }
  }
}
