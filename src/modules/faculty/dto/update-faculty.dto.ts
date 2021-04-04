import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';

export class UpdateFacultyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphaSpace()
  @MaxLength(Constrains.STRING_MAX_LEN)
  name?: string;

  @IsOptional()
  @IsDateString()
  firstClosureDate?: Date;

  @IsOptional()
  @IsDateString()
  secondClosureDate?: Date;
}
