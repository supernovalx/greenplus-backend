import { User } from 'src/modules/user/entities/user.entity';

export class ConversationDto {
  receiver: User;

  lastMessage: {
    content: string;
    senderId: number;
    createdAt: Date;
  };
}
