import { IsDateString, IsOptional } from 'class-validator';

export class SetGlobalClosureDatesDto {
  @IsOptional()
  @IsDateString()
  firstClosureDate?: string;

  @IsOptional()
  @IsDateString()
  secondClosureDate?: string;
}
