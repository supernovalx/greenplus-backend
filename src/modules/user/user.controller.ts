import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { GlobalHelper } from '../helper/global.helper';
import { Auth } from '../auth/auth.decorator';
import { Role } from 'src/enums/roles';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private globalHelper: GlobalHelper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  // @Auth(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.create(createUserDto);
    return new UserDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER)
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new UserDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const userFind = await this.userService.findOne(id);
    if (userFind === null) {
      throw new NotFoundException();
    }

    return new UserDto(userFind);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    if (this.globalHelper.checkObjectIsEmpty(updateUserDto)) {
      throw new BadRequestException();
    }

    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (updatedUser === null) {
      throw new BadRequestException();
    }

    return new UserDto(updatedUser);
  }
}
