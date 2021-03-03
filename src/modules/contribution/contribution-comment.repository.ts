import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { EntityRepository } from 'typeorm';
import { ContributionComment } from './entities/contribution-comment.entity';

@EntityRepository(ContributionComment)
export class ContributionCommentRepository extends BaseRepository<ContributionComment> {
  constructor() {
    super('Contribution comment');
  }

  async findOneByIdWithRelations(id: number): Promise<ContributionComment> {
    const rs: ContributionComment | undefined = await this.repository.findOne(
      id,
      {
        relations: ['user'],
      },
    );
    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(this.entityName),
      );
    }

    return rs;
  }
}
