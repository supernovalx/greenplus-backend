import { Message } from '../entity/message.entity';

export class MessageDto {
  id: number;

  message: string;

  createdAt: Date;

  senderId: number;

  senderName: string;

  constructor(message: Message) {
    this.id = message.id;
    this.message = message.content;
    this.senderId = message.senderId;
    this.senderName = message.sender.fullName;
    this.createdAt = message.createAt;
  }
}
