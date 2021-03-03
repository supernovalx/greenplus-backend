import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateContributionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];

  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: any;
}
