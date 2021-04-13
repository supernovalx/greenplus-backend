import { Cipher } from 'crypto';
import { max, uniqBy } from 'lodash';
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

  async findConversationsOfUser(userId: number): Promise<Conversation[]> {
    let conversations: Conversation[] = await this.repository
      .createQueryBuilder('message')
      .select([
        'COUNT(*) as count',
        'message.receiverId AS receiverId',
        'MAX(message.id) as lastmessageid',
      ])
      .groupBy('message.receiverId')
      .where('message.senderId = :senderId', { senderId: userId })
      .getRawMany();
    conversations.push(
      ...((await this.repository
        .createQueryBuilder('message')
        .select([
          'COUNT(*) as count',
          'message.senderId AS receiverId',
          'MAX(message.id) as lastmessageid',
        ])
        .groupBy('message.senderId')
        .where('message.receiverId = :receiverId', { receiverId: userId })
        .getRawMany()) as Conversation[]),
    );
    console.log(conversations);
    let rs = uniqBy(conversations, (conversation) => conversation.receiverid);
    console.log(rs);
    // @ts-ignore
    let rs2 = rs.map((conversation) => {
      return {
        ...conversation,
        lastmessageid: max(
          conversations
            .filter((c) => conversation.receiverid === c.receiverid)
            .map((c) => c.lastmessageid),
        ),
      };
    });

    console.log(rs2);
    // @ts-ignore
    return rs2;
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

export interface Conversation {
  receiverid: number;
  lastmessageid: number;
}
