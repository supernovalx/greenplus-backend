import { IsNotEmpty } from 'class-validator';

export class CreateContributionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
