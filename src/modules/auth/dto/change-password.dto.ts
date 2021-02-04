import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { ValidPassword } from 'src/common/validator/password.validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidPassword)
  newPassword: string;
}
