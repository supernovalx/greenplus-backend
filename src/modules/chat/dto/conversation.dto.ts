import { User } from 'src/modules/user/entities/user.entity';
import { Message } from '../entity/message.entity';

export class ConversationDto {
  receiver: User;

  lastMessage: Message;
}
