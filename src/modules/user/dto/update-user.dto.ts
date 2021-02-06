import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Validate(ValidPassword)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  facultyId?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
