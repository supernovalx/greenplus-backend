import {
  IsJWT,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Constrains } from 'src/common/const/constraint';
import { ValidPassword } from 'src/common/validator/password.validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  resetToken: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  @MaxLength(Constrains.PASSWORD_MAX_LEN)
  newPassword: string;
}
