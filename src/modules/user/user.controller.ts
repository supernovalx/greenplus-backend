import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Role } from 'src/common/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { GlobalHelper } from '../helper/global.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
@ApiExtraModels(PaginatedDto)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly globalHelper: GlobalHelper,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user: User = await this.userService.create(createUserDto);

    return new UserDto(user);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Find all users' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
    @Query() findAllQueryDto: FindAllUserQueryDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedDto<UserDto>> {
    // Cordinator can only view their faculty's students
    if (user.role === Role.MARKETING_CORDINATOR) {
      findAllQueryDto.facultyId = user.facultyId;
    }
    // Student can only find CORDINATOR
    if (user.role === Role.STUDENT) {
      findAllQueryDto.facultyId = user.facultyId;
      findAllQueryDto.role = Role.MARKETING_CORDINATOR;
    }
    // Find all users
    const [users, count] = await this.userService.findAll(
      paginatedQueryDto,
      findAllQueryDto,
    );
    const rs: PaginatedDto<UserDto> = {
      total: count,
      results: users.map((user) => new UserDto(user)),
    };

    return rs;
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Find user by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const userFind: User = await this.userService.findOne(id);

    return new UserDto(userFind);
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<UserDto> {
    const updatedUser: User = await this.userService.update(
      id,
      user.id,
      updateUserDto,
    );

    return new UserDto(updatedUser);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete(id);
  }
}
