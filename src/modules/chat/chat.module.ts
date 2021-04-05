import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([MessageRepository])],
  controllers: [ChatController],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
