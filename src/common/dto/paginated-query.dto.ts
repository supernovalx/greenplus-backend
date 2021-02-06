import { IsNumberString } from 'class-validator';

export class PaginatedQueryDto {
  @IsNumberString()
  offset: number = 0;

  @IsNumberString()
  limit: number = 10;
}
