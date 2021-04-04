import { IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';

export class UpdateContributionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsAlphaSpace()
  @MaxLength(Constrains.STRING_MAX_LEN)
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(Constrains.STRING_MAX_LEN)
  description?: string;
}
