import { Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ConversationDto } from './dto/conversation.dto';
import { FindAllMessageQueryDto } from './dto/find-all-message.dto';
import { Message } from './entity/message.entity';
import {
  DistinctConversationResult,
  MessageRepository,
} from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private userRepository: UserRepository,
  ) {}

  async getConversations(user: User): Promise<ConversationDto[]> {
    const conversations: DistinctConversationResult[] = await this.messageRepository.findConversationsBySenderId(
      user.id,
    );
    const receivers: UserDto[] = (
      await this.userRepository.findByIdsWithRelations(
        conversations.map(
          (conversation: DistinctConversationResult) => conversation.receiverid,
        ),
      )
    ).map((user: User) => new UserDto(user));
    const lastMessageIds: number[] = conversations.map(
      (conversation: DistinctConversationResult) => conversation.id,
    );
    const lastMessages: Message[] = await this.messageRepository.findByIds(
      lastMessageIds,
    );

    const rs = conversations.map((conversation: DistinctConversationResult) => {
      return {
        receiver: receivers.find(
          (receiver: UserDto) => receiver.id === conversation.receiverid,
        ),
        lastMessage: lastMessages.find(
          (message: Message) => message.id === conversation.id,
        ),
      };
    });

    // @ts-ignore
    return rs;
  }

  async getMessages(
    senderId: number,
    receiverId: number,
    paginatedQueryDto: PaginatedQueryDto,
    findAllQueryDto: FindAllMessageQueryDto,
  ): Promise<[Message[], number]> {
    return await this.messageRepository.findAll(
      senderId,
      receiverId,
      paginatedQueryDto,
      findAllQueryDto,
    );
  }
}
