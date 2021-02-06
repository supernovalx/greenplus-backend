import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindAllUserQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsNumberString()
  facultyId?: number;
}
