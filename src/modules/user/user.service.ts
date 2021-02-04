import { Injectable } from '@nestjs/common';
import { GlobalHelper } from 'src/modules/helper/global.helper';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly globalHelper: GlobalHelper,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    let rs = null;
    // Generate user entity from dto
    const userCreate = await this.userRepository.create(createUserDto);
    // Generate random password
    const password = this.globalHelper.generateRandomPassword();
    const hashedPassword = await this.globalHelper.hashPassword(password);
    userCreate.password = hashedPassword;
    // Create new user
    const createResult = await this.userRepository.save(userCreate);
    // Send account information mail
    const sendMailResult = await this.mailService.sendAccountInfoMail(
      userCreate,
      password,
    );
    if (!sendMailResult) {
      // Delete user
      await this.userRepository.delete(createResult.id);

      return rs;
    }
    rs = createResult;

    return rs;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    let rs: User | null = null;

    const userFind = await this.userRepository.findOne(id);
    if (!userFind) {
      return rs;
    }

    return userFind;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    let rs: User | null = null;
    if (!email) {
      return rs;
    }

    const userFind = await this.userRepository.find({ email: email });
    if (!userFind) {
      return rs;
    }

    return userFind[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    let rs: User | null = null;
    if (this.globalHelper.checkObjectIsEmpty(updateUserDto)) {
      return rs;
    }
    // Check user exists
    const userFind = await this.findOne(id);
    if (!userFind) {
      return rs;
    }
    // Update user
    const updateResult = await this.userRepository.update(id, updateUserDto);
    if (updateResult.affected != 1) {
      return rs;
    }
    // Get user
    const updatedUser = await this.userRepository.findOne(id, {
      relations: ['faculty'],
    });
    if (!updatedUser) {
      return rs;
    }
    rs = updatedUser;

    return rs;
  }

  async changePassword(id: number, newPassword: string): Promise<boolean> {
    let rs = false;
    // Hash new password
    const hashedPassword = await this.globalHelper.hashPassword(newPassword);
    if (!hashedPassword) {
      return rs;
    }
    // Set new password
    const updateResult = await this.userRepository.update(id, {
      password: hashedPassword,
      forceChangePassword: false,
    });
    if (updateResult.affected != 1) {
      return rs;
    }
    rs = true;

    return rs;
  }
}
