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
import { GlobalHelper } from '../helper/global.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
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
    const user = await this.userService.create(createUserDto);

    return new UserDto(user);
  }

  @Get()
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: 'Find all users' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
    @Query() findAllQueryDto: FindAllUserQueryDto,
  ): Promise<PaginatedDto<UserDto>> {
    const [users, count] = await this.userService.findAll(
      paginatedQueryDto,
      findAllQueryDto.query,
      findAllQueryDto.facultyId,
    );
    const rs: PaginatedDto<UserDto> = {
      total: count,
      results: users.map((user) => new UserDto(user)),
    };

    return rs;
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: 'Find user by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const userFind = await this.userService.findOne(id);

    return new UserDto(userFind);
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    if (updatedUser === null) {
      throw new BadRequestException();
    }

    return new UserDto(updatedUser);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
  }
}
