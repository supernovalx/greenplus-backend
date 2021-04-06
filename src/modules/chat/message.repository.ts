import { BaseRepository } from 'src/common/base.repository';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { FindAllMessageQueryDto } from './dto/find-all-message.dto';
import { Message } from './entity/message.entity';

@EntityRepository(Message)
export class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super('Message');
  }

  async findConversationsBySenderId(
    senderId: number,
  ): Promise<DistinctConversationResult[]> {
    let distinctConversations: DistinctConversationResult[] = await this.repository
      .createQueryBuilder('message')
      .select([
        'COUNT(*) as count',
        'message.receiverId AS receiverId',
        'MAX(message.id) as id',
      ])
      .groupBy('message.receiverId')
      .where('message.senderId = :senderId', { senderId: senderId })
      .getRawMany();
    distinctConversations.push(
      ...((await this.repository
        .createQueryBuilder('message')
        .select([
          'COUNT(*) as count',
          'message.senderId AS receiverId',
          'MAX(message.id) as id',
        ])
        .groupBy('message.senderId')
        .where('message.receiverId = :receiverId', { receiverId: senderId })
        .getRawMany()) as DistinctConversationResult[]),
    );

    return distinctConversations;
  }

  async findAll(
    senderId: number,
    receiverId: number,
    query: FindAllMessageQueryDto,
  ): Promise<[Message[], number]> {
    const qb: SelectQueryBuilder<Message> = this.repository.createQueryBuilder(
      'message',
    );
    // Filters
    if (query.startMessageId) {
      qb.andWhere('message.id < :id', {
        id: query.startMessageId,
      });
    }
    // qb.andWhere('message.senderId = :senderId', { senderId: senderId });
    // qb.andWhere('message.receiverId = :receiverId', { receiverId: receiverId });
    qb.andWhere(
      '((message.senderId = :senderId AND message.receiverId = :receiverId) OR (message.senderId = :receiverId AND message.receiverId = :senderId))',
      { senderId: senderId, receiverId: receiverId },
    );
    // Order
    qb.orderBy('message.id', 'DESC');
    // Pagination
    qb.take(query.limit);

    return await qb.getManyAndCount();
  }

  async findByIds(ids: number[]): Promise<Message[]> {
    return await this.repository.findByIds(ids);
  }
}

export interface DistinctConversationResult {
  count: string;
  receiverid: number;
  id: number;
}
