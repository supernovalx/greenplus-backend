import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { Role } from 'src/common/enums/roles';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { FindAllUserQueryDto } from './dto/find-all-user-query.dto';
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

  async findMarketingCordinatorByFacultyId(facultyId: number): Promise<User[]> {
    const rs: User[] = await this.repository.find({
      where: { facultyId: facultyId, role: Role.MARKETING_CORDINATOR },
    });

    return rs;
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query: FindAllUserQueryDto,
  ): Promise<[User[], number]> {
    const qb: SelectQueryBuilder<User> = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.faculty', 'faculty');
    // Filters
    if (query.query) {
      qb.andWhere('LOWER(user.fullName) LIKE LOWER(:query)', {
        query: `%${query.query}%`,
      });
    }
    if (query.facultyId) {
      qb.andWhere('user.facultyId = :facultyId', {
        facultyId: query.facultyId,
      });
    }
    if (query.role) {
      qb.andWhere('user.role = :role', {
        role: query.role,
      });
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
