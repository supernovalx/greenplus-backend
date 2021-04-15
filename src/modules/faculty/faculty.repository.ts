import { BadRequestException } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { OrderType } from 'src/common/enums/order-types';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { Faculty } from './entities/faculty.entity';

@EntityRepository(Faculty)
export class FacultyRepository extends BaseRepository<Faculty> {
  constructor() {
    super('Faculty');
  }

  async ensureNameIsUniqueOrFail(name: string): Promise<void> {
    const faculty: Faculty | undefined = await this.repository.findOne({
      name: name,
    });
    if (faculty !== undefined) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.MUST_BE_UNIQUE(`${this.entityName} name`),
      );
    }
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query?: string,
    createAtOrderType?: OrderType,
  ): Promise<[Faculty[], number]> {
    const qb: SelectQueryBuilder<Faculty> = this.repository
      .createQueryBuilder('faculty')
      .leftJoinAndSelect('faculty.contributions', 'contributions');
    // Filters
    if (query) {
      qb.andWhere('LOWER(faculty.name) LIKE LOWER(:query)', {
        query: `%${query}%`,
      });
    }
    if (createAtOrderType) {
      qb.addOrderBy('faculty.createAt', createAtOrderType);
    }
    // Pagination
    qb.skip(paginatedQueryDto.offset);
    qb.take(paginatedQueryDto.limit);

    return await qb.getManyAndCount();
  }

  async countTotal(): Promise<number> {
    return await this.repository.count();
  }
}
