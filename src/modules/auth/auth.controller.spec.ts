import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
            signOptions: {
              expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, JwtAuthGuard],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
