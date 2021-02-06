import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { assert } from 'console';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { GlobalHelper } from '../helper/global.helper';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { AccessTokenPayloadDto } from './dto/access-token-payload.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordTokenPayloadDto } from './dto/reset-password-token-payload.dto copy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly globalHelper: GlobalHelper,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginPayloadDto> {
    let user: User;
    try {
      // Find user
      user = await this.userRepository.findOneByEmailWithRelations(
        loginDto.email,
      );
      // Check password match
      const matchResult = await this.globalHelper.comparePassword(
        loginDto.password,
        user.password,
      );
      this.globalHelper.truthyOrFail(matchResult);
    } catch {
      throw new BadRequestException(ExceptionMessage.INVALID.CREDENTIALS);
    }
    // Generate token and payload
    const rs = {
      access_token: await this.generateAccessToken(user),
      user: new UserDto(user),
    };

    return rs;
  }

  async generateAccessToken(user: User): Promise<string> {
    try {
      const jwtPayload: AccessTokenPayloadDto = { sub: user.id };
      const rs = await this.jwtService.signAsync(jwtPayload);

      return rs;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ExceptionMessage.FAILED.SIGN_JWT);
    }
  }

  async generateResetPasswordToken(user: User): Promise<string> {
    try {
      const jwtPayload: ResetPasswordTokenPayloadDto = {
        sub: user.id,
        hash: await this.globalHelper.hashPassword(user.password),
      };
      const rs = await this.jwtService.signAsync(jwtPayload);

      return rs;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ExceptionMessage.FAILED.SIGN_JWT);
    }
  }

  async parseResetPasswordToken(token: string): Promise<User> {
    // Check token valid
    let resetPayload;
    try {
      resetPayload = await this.jwtService.verifyAsync<ResetPasswordTokenPayloadDto>(
        token,
      );
    } catch (err) {
      console.log(err);

      throw new BadRequestException(ExceptionMessage.INVALID.TOKEN);
    }
    // Check user exists
    const userFind = await this.userRepository.findOneById(resetPayload.sub);
    // Check hash valid
    const compareResult = await this.globalHelper.comparePassword(
      userFind.password,
      resetPayload.hash,
    );
    if (!compareResult) {
      throw new BadRequestException(ExceptionMessage.INVALID.TOKEN);
    }

    return userFind;
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    // Find user
    const userFind = await this.userRepository.findOneByEmailWithRelations(
      email,
    );
    // Generate reset password token
    const resetPasswordToken = await this.generateResetPasswordToken(userFind);
    // Send mail
    await this.mailService.sendResetPasswordMail(email, resetPasswordToken);
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    // Check new and old passwords are the same
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.NEW_PASSWORD_SAME_AS_OLD,
      );
    }
    // Check current password matches
    const compareResult = await this.globalHelper.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!compareResult) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.PASSWORD_NOT_MATCH,
      );
    }
    // Change password
    await this.userService.changePassword(
      user.id,
      changePasswordDto.newPassword,
    );
  }
}
