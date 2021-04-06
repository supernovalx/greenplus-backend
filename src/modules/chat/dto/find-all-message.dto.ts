import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllMessageQueryDto {
  @IsOptional()
  @IsNumberString()
  startMessageId?: number;
}
