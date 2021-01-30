import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GlobalHelper } from '../helper/global.helper';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { LoginDto } from './dto/login.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private globalHelper: GlobalHelper,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginPayloadDto | null> {
    let rs: LoginPayloadDto | null = null;
    // Find user
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      return rs;
    }
    // Check password match
    const matchResult = await this.globalHelper.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!matchResult) {
      return rs;
    }
    // Generate token and payload
    rs = {
      access_token: this.generateAccessToken(user),
      user: new UserDto(user),
    };

    return rs;
  }

  generateAccessToken(user: User): string {
    let rs: string = '';
    const jwtPayload: TokenPayloadDto = { sub: user.id };
    rs = this.jwtService.sign(jwtPayload);

    return rs;
  }

  forgetPassword(email: string) {
    return `This action returns all auth`;
  }
}
