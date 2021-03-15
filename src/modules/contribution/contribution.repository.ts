import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { FindAllContributionQueryDto } from './dto/find-all-contribution-query.dto';
import { Contribution } from './entities/contribution.entity';

@EntityRepository(Contribution)
export class ContributionRepository extends BaseRepository<Contribution> {
  constructor() {
    super('Contribution');
  }

  async findOneByIdWithRelations(id: number): Promise<Contribution> {
    const rs: Contribution | undefined = await this.repository.findOne(id, {
      relations: ['faculty', 'user', 'comments', 'files'],
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
    query: FindAllContributionQueryDto,
  ): Promise<[Contribution[], number]> {
    const qb: SelectQueryBuilder<Contribution> = this.repository
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.faculty', 'faculty')
      .leftJoinAndSelect('contribution.user', 'user');
    // Filters
    if (query.query) {
      qb.andWhere('LOWER(contribution.name) LIKE LOWER(:query)', {
        query: `%${query.query}%`,
      });
    }
    if (query.isPublished) {
      qb.andWhere('contribution.isPublished = :isPublished', {
        isPublished: query.isPublished,
      });
    }
    if (query.facultyId) {
      qb.andWhere('contribution.facultyId = :facultyId', {
        facultyId: query.facultyId,
      });
    }
    if (query.authorId) {
      qb.andWhere('contribution.userId = :authorId', {
        authorId: query.authorId,
      });
    }
    // Pagination
    qb.skip(paginatedQueryDto.offset);
    qb.take(paginatedQueryDto.limit);

    return await qb.getManyAndCount();
  }
}
