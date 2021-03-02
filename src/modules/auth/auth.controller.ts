import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { CurrentUser } from './decorator/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBadRequestResponse({ description: 'Wrong email or password' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    let rs: LoginResponseDto = await this.authService.login(loginDto);

    return rs;
  }

  @Post('/send-reset-password-mail')
  @ApiOperation({
    summary: 'Send an email contains reset password link to user',
  })
  @ApiBadRequestResponse({ description: 'Wrong email' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async sendResetPasswordMail(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    await this.authService.sendResetPasswordMail(forgetPasswordDto.email);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset password using reset token from email',
  })
  @ApiBadRequestResponse({
    description: 'Reset token invalid, password invalid',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    // Parse reset password token
    const user: User = await this.authService.parseResetPasswordToken(
      resetPasswordDto.resetToken,
    );
    // Change password
    await this.userService.changePassword(
      user.id,
      resetPasswordDto.newPassword,
    );
  }

  @Post('/change-password')
  @Auth()
  @ApiOperation({ summary: 'Change password' })
  @ApiBadRequestResponse({
    description: 'Passwords invalid',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.authService.changePassword(user, changePasswordDto);
  }
}
