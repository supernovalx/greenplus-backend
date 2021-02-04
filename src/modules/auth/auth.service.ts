import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GlobalHelper } from '../helper/global.helper';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AccessTokenPayloadDto } from './dto/access-token-payload.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordTokenPayloadDto } from './dto/reset-password-token-payload.dto copy';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly globalHelper: GlobalHelper,
    private readonly mailService: MailService,
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
    const jwtPayload: AccessTokenPayloadDto = { sub: user.id };
    rs = this.jwtService.sign(jwtPayload);

    return rs;
  }

  async generateResetPasswordToken(user: User): Promise<string> {
    let rs: string = '';
    const jwtPayload: ResetPasswordTokenPayloadDto = {
      sub: user.id,
      hash: await this.globalHelper.hashPassword(user.password),
    };
    rs = this.jwtService.sign(jwtPayload);

    return rs;
  }

  async checkResetPasswordTokenValid(token: string): Promise<User | null> {
    let rs = null;
    // Check token valid
    const resetPayload = await this.jwtService.verifyAsync<ResetPasswordTokenPayloadDto>(
      token,
    );
    if (this.globalHelper.checkObjectIsEmpty(resetPayload)) {
      return rs;
    }
    // Check user exists
    const userFind = await this.userService.findOne(resetPayload.sub);
    if (!userFind) {
      return rs;
    }
    // Check hash valid
    const hashResult = await this.globalHelper.comparePassword(
      userFind.password,
      resetPayload.hash,
    );
    if (!hashResult) {
      return rs;
    }
    rs = userFind;

    return rs;
  }

  async forgetPassword(user: User): Promise<boolean> {
    let rs = false;
    // Generate reset password token
    const resetPasswordToken = await this.generateResetPasswordToken(user);
    // Send mail
    const sendResult = await this.mailService.sendResetPasswordMail(
      user.email,
      resetPasswordToken,
    );
    if (!sendResult) {
      return rs;
    }
    rs = true;

    return rs;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    let rs = false;
    // Check reset token valid
    const verifiedUser = await this.checkResetPasswordTokenValid(
      resetPasswordDto.resetToken,
    );
    if (verifiedUser === null) {
      return rs;
    }
    // Hash new password
    const hashedPassword = await this.globalHelper.hashPassword(
      resetPasswordDto.newPassword,
    );
    if (!hashedPassword) {
      return rs;
    }
    // Set new password
    const setResult = await this.userService.update(verifiedUser.id, {
      password: hashedPassword,
    });
    if (setResult === null) {
      return rs;
    }
    rs = true;

    return rs;
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    let rs = false;
    // Check new and old passwords are the same
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      return rs;
    }
    // Check current password matches
    const matchResult = await this.globalHelper.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!matchResult) {
      return rs;
    }
    // Hash new password
    const hashedPassword = await this.globalHelper.hashPassword(
      changePasswordDto.newPassword,
    );
    if (!hashedPassword) {
      return rs;
    }
    // Set new password
    const setResult = await this.userService.update(user.id, {
      password: hashedPassword,
    });
    if (setResult === null) {
      return rs;
    }
    rs = true;

    return rs;
  }
}
