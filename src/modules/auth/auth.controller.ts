import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { CurrentUser } from './decorator/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
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
  @ApiBadRequestResponse({ description: 'Wrong email' })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    // Check user exists
    const userFind = await this.userService.findOneByEmail(
      forgetPasswordDto.email,
    );
    if (userFind === null) {
      throw new BadRequestException('Wrong email');
    }
    // Send mail
    let sendMailResult = await this.authService.forgetPassword(userFind);
    if (!sendMailResult) {
      throw new InternalServerErrorException();
    }
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
    const resetResult = await this.authService.resetPassword(resetPasswordDto);
    if (!resetResult) {
      throw new BadRequestException('Reset token invalid, password invalid');
    }
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
    const changeResult = await this.authService.changePassword(
      user,
      changePasswordDto,
    );
    if (!changeResult) {
      throw new BadRequestException('Passwords invalid');
    }
  }
}
