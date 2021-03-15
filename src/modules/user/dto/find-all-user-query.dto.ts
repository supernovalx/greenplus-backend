import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/common/enums/roles';

export class FindAllUserQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  // @IsOptional()
  // @IsNumberString({ no_symbols: true })
  @ApiHideProperty()
  facultyId?: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
