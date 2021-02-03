import { ContributionFile } from '../entities/contribution-file.entity';
import { CommentDto } from './comment.dto';
import { ContributionDto } from './contribution.dto';

export class DetailedContributionDto extends ContributionDto {
  comments: CommentDto[];

  files: ContributionFile[];
}
