import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateContributionDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
