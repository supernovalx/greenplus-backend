import { IsNumberString } from 'class-validator';

export class PaginatedQueryDto {
  @IsNumberString({ no_symbols: true })
  offset: number = 0;

  @IsNumberString({ no_symbols: true })
  limit: number = 10;
}
