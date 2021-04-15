import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { DeleteResult, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { FindAllContributionQueryDto } from './dto/find-all-contribution-query.dto';
import { Contribution } from './entities/contribution.entity';

@EntityRepository(Contribution)
export class ContributionRepository extends BaseRepository<Contribution> {
  constructor() {
    super('Contribution');
  }

  async deleteByFacultyId(facultyId: number): Promise<void> {
    const deleteResult: DeleteResult = await this.repository.delete({
      facultyId: facultyId,
    });
    // if (deleteResult.affected && deleteResult.affected === 0) {
    //   throw new InternalServerErrorException(
    //     ExceptionMessage.FAILED.DELETE_ENTITY(this.entityName),
    //   );
    // }
  }

  async deleteAll(): Promise<void> {
    const deleteResult: DeleteResult = await this.repository.delete({});
    // if (deleteResult.affected && deleteResult.affected === 0) {
    //   throw new InternalServerErrorException(
    //     ExceptionMessage.FAILED.DELETE_ENTITY(this.entityName),
    //   );
    // }
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

  async findPublishedWithRelations(): Promise<Contribution[]> {
    const rs: Contribution[] = await this.repository.find({
      relations: ['files'],
      where: {
        isPublished: true,
      },
    });

    return rs;
  }

  async findAllWithPagination(
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
    if (query.viewOrderType) {
      qb.addOrderBy('contribution.views', query.viewOrderType);
    }
    // Pagination
    qb.skip(paginatedQueryDto.offset);
    qb.take(paginatedQueryDto.limit);

    return await qb.getManyAndCount();
  }

  async findAll(): Promise<Contribution[]> {
    return await this.repository.find();
  }

  async countNumberOfDistinctStudents(): Promise<number> {
    const { count } = await this.repository
      .createQueryBuilder('contribution')
      .select('COUNT(DISTINCT contribution.userId) as count')
      .getRawOne();

    return Number(count);
  }

  async countNumberOfDistinctFaculty(): Promise<number> {
    const { count } = await this.repository
      .createQueryBuilder('contribution')
      .select('COUNT(DISTINCT contribution.facultyId) as count')
      .getRawOne();

    return Number(count);
  }

  async largestPublishedCountOfSingleFaculty(): Promise<number> {
    const [{ count }] = await this.repository.query(
      `select max("cnt") as count from (select count(*) as cnt from contribution where "isPublished" = true group by "facultyId") as "m"`,
    );

    return Number(count);
  }

  async newSubmissionsIn7Days(): Promise<number> {
    let last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const { count } = await this.repository
      .createQueryBuilder('contribution')
      .select('count(*) as count')
      .where('contribution.createAt > :last7Days', { last7Days: last7Days })
      .getRawOne();

    return Number(count);
  }
}
