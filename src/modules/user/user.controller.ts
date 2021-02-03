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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { GlobalHelper } from '../helper/global.helper';
import { Auth } from '../auth/decorator/auth.decorator';
import { Role } from 'src/enums/roles';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated.decorator';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

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
  @ApiOperation({ summary: '*WIP* Create new user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.create(createUserDto);

    return new UserDto(user);
  }

  @Get()
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: '*WIP* Find all users' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiPaginatedResponse(UserDto)
  async findAll(
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedDto<UserDto>> {
    const users = await this.userService.findAll();
    // @ts-ignore
    return users.map((user) => new UserDto(user));
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.MARKETING_MANAGER, Role.MARKETING_CORDINATOR)
  @ApiOperation({ summary: '*WIP* Find user by id' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const userFind = await this.userService.findOne(id);
    if (userFind === null) {
      throw new NotFoundException();
    }

    return new UserDto(userFind);
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Update user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'User not found' })
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

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '*WIP* Delete user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {}
}
