import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';

export class CreateContributionDto {
  @IsNotEmpty()
  @IsAlphaSpace()
  @MaxLength(Constrains.STRING_MAX_LEN)
  name: string;

  @IsNotEmpty()
  @MaxLength(Constrains.STRING_MAX_LEN)
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];

  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: any;
}
