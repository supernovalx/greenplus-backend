import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalHelper } from '../helper/global.helper';
import { HelperModule } from '../helper/helper.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
