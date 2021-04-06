import { Injectable } from '@nestjs/common';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async getConversations(user: User): Promise<Conversation[]> {
    const messages: Message[] = await this.messageRepository.findBySenderId(
      user.id,
    );
  }
}
