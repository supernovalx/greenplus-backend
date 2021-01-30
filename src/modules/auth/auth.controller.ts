import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto): Promise<LoginPayloadDto> {
    let rs = await this.authService.login(loginDto);
    if (rs === null) {
      throw new BadRequestException('Wrong email or password!');
    }
    return rs;
  }

  @Post('/forget-password')
  @ApiOperation({
    summary: 'Send an email contains reset password link to user',
  })
  forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<string> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset password using reset token from email' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }

  @Post('/change-password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }
}
