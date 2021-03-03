import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AccessTokenResponseDto): Promise<User | null> {
    try {
      // Check user exists
      return await this.userRepository.findOneByIdWithRelations(payload.sub);
    } catch (err) {
      return null;
    }
  }
}
