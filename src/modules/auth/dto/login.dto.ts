import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  password: string;
}
