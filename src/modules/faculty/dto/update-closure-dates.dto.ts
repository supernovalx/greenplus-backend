import { IsDateString, IsOptional } from 'class-validator';

export class UpdateClosureDatesDto {
  @IsOptional()
  @IsDateString()
  firstClosureDate?: Date;

  @IsOptional()
  @IsDateString()
  secondClosureDate?: Date;
}
