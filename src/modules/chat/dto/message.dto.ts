import { Message } from '../entity/message.entity';

export class MessageDto {
  id: number;

  content: string;

  createdAt: Date;

  senderId: number;

  constructor(message: Message) {
    this.id = message.id;
    this.content = message.content;
    this.senderId = message.senderId;
    this.createdAt = message.createAt;
  }
}
