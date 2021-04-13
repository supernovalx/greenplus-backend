import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ConversationDto } from './dto/conversation.dto';
import { FindAllMessageQueryDto } from './dto/find-all-message.dto';
import { Message } from './entity/message.entity';
import { Conversation, MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private userRepository: UserRepository,
  ) {}

  async getConversations(user: User): Promise<ConversationDto[]> {
    // Find conversations
    const conversations: Conversation[] = await this.messageRepository.findConversationsOfUser(
      user.id,
    );
    // Find receivers
    const receivers: UserDto[] = (
      await this.userRepository.findByIdsWithRelations(
        conversations.map(
          (conversation: Conversation) => conversation.receiverid,
        ),
      )
    ).map((user: User) => new UserDto(user));
    // Extract message ids
    const lastMessageIds: number[] = conversations.map(
      (conversation: Conversation) => conversation.lastmessageid,
    );
    // Get last messages
    const lastMessages: Message[] = await this.messageRepository.findByIds(
      lastMessageIds,
    );

    const rs = conversations.map((conversation: Conversation) => {
      return {
        receiver: receivers.find(
          (receiver: UserDto) => receiver.id === conversation.receiverid,
        ),
        lastMessage: lastMessages.find(
          (message: Message) => message.id === conversation.lastmessageid,
        ),
      };
    });

    // @ts-ignore
    return rs;
  }

  async getMessages(
    senderId: number,
    receiverId: number,
    findAllQueryDto: FindAllMessageQueryDto,
  ): Promise<[Message[], number]> {
    return await this.messageRepository.findAll(
      senderId,
      receiverId,
      findAllQueryDto,
    );
  }
}
