import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';

export class CreateFacultyDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphaSpace()
  @MaxLength(Constrains.STRING_MAX_LEN)
  name: string;
}
