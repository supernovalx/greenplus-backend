import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AccessTokenPayloadDto } from './dto/access-token-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<User | null> {
    try {
      // Check user exists
      return await this.userService.findOne(payload.sub);
    } catch (err) {
      return null;
    }
  }
}
