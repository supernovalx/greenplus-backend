import { Message } from '../entity/message.entity';

export class MessageDto {
  id: number;

  content: string;

  createdAt: Date;

  constructor(message: Message) {
    this.id = message.id;
    this.content = message.content;
    this.createdAt = message.createAt;
  }
}
