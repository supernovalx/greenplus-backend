import { UserDto } from 'src/modules/user/dto/user.dto';

export class LoginPayloadDto {
  user: UserDto;
  access_token: string;
}
