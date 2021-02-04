import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Validate(ValidPassword)
  password: string;
}
