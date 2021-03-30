import { IsNumber } from 'class-validator';

export class DownloadContributionsDto {
  @IsNumber({}, { each: true })
  contributionIds: number[];
}
