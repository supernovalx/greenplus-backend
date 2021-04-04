import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { ValidPassword } from 'src/common/validator/password.validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(Constrains.EMAIL_MAX_LEN)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  @MaxLength(Constrains.PASSWORD_MAX_LEN)
  password: string;
}
