import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { FacultyModule } from '../faculty/faculty.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    MailModule,
    FacultyModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
