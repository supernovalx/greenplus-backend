import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllMessageQueryDto {
  @IsNumberString({ no_symbols: true })
  limit: number = 10;

  @IsOptional()
  @IsNumberString()
  startMessageId?: number;
}
