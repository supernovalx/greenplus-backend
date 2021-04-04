import { IsEmail, MaxLength } from 'class-validator';
import { Constrains } from 'src/common/const/constraint';

export class ForgetPasswordDto {
  @IsEmail()
  @MaxLength(Constrains.EMAIL_MAX_LEN)
  email: string;
}
