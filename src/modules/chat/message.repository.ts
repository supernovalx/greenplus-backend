import { BaseRepository } from 'src/common/base.repository';
import { EntityRepository } from 'typeorm';
import { Message } from './entity/message.entity';

@EntityRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super('Message');
  }
}
