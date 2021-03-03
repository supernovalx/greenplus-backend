import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindAllPublishedContributionQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  authorId?: number;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  facultyId?: number;
}
