import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('User');
  }

  async findOneByEmailWithRelations(email: string): Promise<User> {
    const rs: User | undefined = await this.repository.findOne(
      { email: email },
      { relations: ['faculty'] },
    );
    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(this.entityName),
      );
    }

    return rs;
  }

  async findOneByIdWithRelations(id: number): Promise<User> {
    const rs: User | undefined = await this.repository.findOne(id, {
      relations: ['faculty'],
    });
    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(this.entityName),
      );
    }

    return rs;
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query?: string,
    facultyId?: number,
  ): Promise<[User[], number]> {
    const qb: SelectQueryBuilder<User> = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.faculty', 'faculty');
    // Filters
    if (query) {
      qb.andWhere('user.fullName LIKE :query', { query: `%${query}%` });
    }
    if (facultyId) {
      qb.andWhere('user.facultyId = :facultyId', { facultyId: facultyId });
    }
    // Pagination
    qb.skip(paginatedQueryDto.offset);
    qb.take(paginatedQueryDto.limit);

    return await qb.getManyAndCount();
  }

  async checkEmailExisted(email: string): Promise<boolean> {
    try {
      return (await this.repository.count({ email: email })) !== 0;
    } catch {
      throw new InternalServerErrorException(ExceptionMessage.FAILED.QUERY);
    }
  }
}
