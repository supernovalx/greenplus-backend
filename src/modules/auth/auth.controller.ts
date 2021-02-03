import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
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
  @ApiBadRequestResponse({ description: 'Wrong email or password' })
  async login(@Body() loginDto: LoginDto): Promise<LoginPayloadDto> {
    let rs = await this.authService.login(loginDto);
    if (rs === null) {
      throw new BadRequestException('Wrong email or password!');
    }

    return rs;
  }

  @Post('/forget-password')
  @ApiOperation({
    summary: '*WIP* Send an email contains reset password link to user',
  })
  @ApiBadRequestResponse({ description: 'Wrong email' })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: '*WIP* Reset password using reset token from email',
  })
  @ApiBadRequestResponse({
    description: 'Reset token invalid, password invalid',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }

  @Post('/change-password')
  @Auth()
  @ApiOperation({ summary: '*WIP* Change password' })
  @ApiBadRequestResponse({
    description: 'Passwords invalid',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    // @ts-ignore
    return this.authService.forgetPassword(email);
  }
}
