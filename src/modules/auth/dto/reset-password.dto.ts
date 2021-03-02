import { IsJWT, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  resetToken: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  newPassword: string;
}
