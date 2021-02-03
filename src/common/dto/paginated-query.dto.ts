import { IsNumberString } from 'class-validator';

export class PaginatedQueryDto {
  @IsNumberString()
  offset: number;

  @IsNumberString()
  limit: number;
}
