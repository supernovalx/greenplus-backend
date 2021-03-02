import { UserDto } from 'src/modules/user/dto/user.dto';

export class LoginResponseDto {
  user: UserDto;
  access_token: string;
}
