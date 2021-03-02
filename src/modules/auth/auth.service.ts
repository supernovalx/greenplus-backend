import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { GlobalHelper } from '../helper/global.helper';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordTokenResponseDto } from './dto/reset-password-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly globalHelper: GlobalHelper,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
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
    // TODO: SRP
    const rs = {
      access_token: await this.generateAccessToken(user),
      user: new UserDto(user),
    };

    return rs;
  }

  async generateAccessToken(user: User): Promise<string> {
    try {
      const jwtPayload: AccessTokenResponseDto = { sub: user.id };
      const rs: string = await this.jwtService.signAsync(jwtPayload);

      return rs;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ExceptionMessage.FAILED.SIGN_JWT);
    }
  }

  async generateResetPasswordToken(user: User): Promise<string> {
    try {
      const jwtPayload: ResetPasswordTokenResponseDto = {
        sub: user.id,
        // Hash the hash of user password. When user changed their password, this token will be invalid
        hash: await this.globalHelper.hashPassword(user.password),
      };
      const rs: string = await this.jwtService.signAsync(jwtPayload);

      return rs;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ExceptionMessage.FAILED.SIGN_JWT);
    }
  }

  async parseResetPasswordToken(token: string): Promise<User> {
    try {
      // Check token valid
      const resetPayload = await this.jwtService.verifyAsync<ResetPasswordTokenResponseDto>(
        token,
      );
      // Check user exists
      const userFind: User = await this.userRepository.findOneById(
        resetPayload.sub,
      );
      // Check hash valid
      const compareResult: boolean = await this.globalHelper.comparePassword(
        userFind.password,
        resetPayload.hash,
      );
      this.globalHelper.truthyOrFail(compareResult);

      return userFind;
    } catch (err) {
      console.log(err);

      throw new BadRequestException(ExceptionMessage.INVALID.TOKEN);
    }
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    // Find user
    const userFind: User = await this.userRepository.findOneByEmailWithRelations(
      email,
    );
    // Generate reset password token
    const resetPasswordToken: string = await this.generateResetPasswordToken(
      userFind,
    );
    // Send mail
    await this.mailService.sendResetPasswordMail(email, resetPasswordToken);
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    // New password must not be the same as old password
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.NEW_PASSWORD_SAME_AS_OLD,
      );
    }
    // Check current password matches
    const compareResult: boolean = await this.globalHelper.comparePassword(
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
