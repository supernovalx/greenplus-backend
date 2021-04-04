import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { IsAlphaSpace } from 'src/common/decorator/alpha-space.decorator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphaSpace()
  @MaxLength(Constrains.FULLNAME_MAX_LEN)
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(Constrains.EMAIL_MAX_LEN)
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Validate(ValidPassword)
  @MaxLength(Constrains.PASSWORD_MAX_LEN)
  password?: string;

  @IsOptional()
  @IsNumber()
  facultyId?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
