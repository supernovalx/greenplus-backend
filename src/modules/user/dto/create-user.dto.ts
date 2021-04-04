import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';
import { Role } from 'src/common/enums/roles';

export class CreateUserDto {
  @IsString()
  @MaxLength(Constrains.FULLNAME_MAX_LEN)
  @IsNotEmpty()
  @IsAlphaSpace()
  fullName: string;

  @IsEmail()
  @MaxLength(Constrains.EMAIL_MAX_LEN)
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsInt()
  facultyId?: number;

  @ApiHideProperty()
  password: string;
}
