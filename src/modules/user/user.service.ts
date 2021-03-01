import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { Role } from 'src/common/enums/roles';
import { GlobalHelper } from 'src/modules/helper/global.helper';
import { FacultyRepository } from '../faculty/faculty.repository';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly facultyRepository: FacultyRepository,
    private readonly globalHelper: GlobalHelper,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.fromDto(createUserDto);
    // Check email existed
    const emailExisted = await this.userRepository.checkEmailExisted(
      user.email,
    );
    if (emailExisted) {
      throw new BadRequestException(ExceptionMessage.INVALID.EMAIL_EXISTED);
    }
    // Check faculty exists
    if (user.role === Role.STUDENT || user.role === Role.MARKETING_CORDINATOR) {
      if (user.facultyId === undefined) {
        throw new BadRequestException(
          ExceptionMessage.INVALID.MISSING_FACULTY_ID,
        );
      }
      const facultyFind = await this.facultyRepository.findOneById(
        user.facultyId,
      );
      user.facultyId = facultyFind.id;
    } else {
      user.facultyId = undefined;
    }
    // Generate random password
    const randomPassword = this.globalHelper.generateRandomPassword();
    const hashedPassword = await this.globalHelper.hashPassword(randomPassword);
    user.password = hashedPassword;
    // Create new user
    const newUser = await this.userRepository.create(user);
    try {
      // Send account information mail
      await this.mailService.sendAccountInfoMail(newUser, randomPassword);

      return await this.userRepository.findOneByIdWithRelations(newUser.id);
    } catch (err) {
      // Delete user
      await this.userRepository.deleteOne(newUser.id);

      throw err;
    }
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOneById(id);

    return user;
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query?: string,
    facultyId?: number,
  ): Promise<[User[], number]> {
    // TODO: Cordinator can only view their faculty's students

    return await this.userRepository.findAll(
      paginatedQueryDto,
      query,
      facultyId,
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Hash password
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = await this.globalHelper.hashPassword(
        updateUserDto.password,
      );
    }
    // Update user
    await this.userRepository.updateOne(id, updateUserDto);
    // Get user
    return await this.userRepository.findOneById(id);
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    // Hash new password
    const hashedPassword = await this.globalHelper.hashPassword(newPassword);
    // Set new password
    await this.userRepository.updateOne(id, {
      password: hashedPassword,
      forceChangePassword: false,
    });
  }

  async delete(id: number): Promise<void> {
    // Prevent delete ADMIN
    const userFind = await this.userRepository.findOneById(id);
    if (userFind.role === Role.ADMIN) {
      throw new BadRequestException(ExceptionMessage.INVALID.CANT_DELETE_ADMIN);
    }

    await this.userRepository.deleteOne(id);
  }
}
