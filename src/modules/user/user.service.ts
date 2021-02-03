import { Injectable } from '@nestjs/common';
import { GlobalHelper } from 'src/modules/helper/global.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly globalHelper: GlobalHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userCreate = await this.userRepository.create(createUserDto);

    // Generate random password
    const password = this.globalHelper.generateRandomPassword();
    console.log('Password: ', password);
    const hashedPassword = await this.globalHelper.hashPassword(password);
    userCreate.password = hashedPassword;

    return await this.userRepository.save(userCreate);
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
}
