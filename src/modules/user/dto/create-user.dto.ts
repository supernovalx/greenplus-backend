import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums/roles';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsInt()
  facultyId?: number;

  @ApiHideProperty()
  password: string;
}
