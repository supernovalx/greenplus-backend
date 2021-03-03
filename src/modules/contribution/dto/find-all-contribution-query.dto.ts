import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindAllContributionQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsBooleanString()
  isPublished?: boolean;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  authorId?: number;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  facultyId?: number;
}
