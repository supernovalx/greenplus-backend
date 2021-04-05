import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { EntityRepository } from 'typeorm';
import { ContributionFile } from './entities/contribution-file.entity';

@EntityRepository(ContributionFile)
export class ContributionFileRepository extends BaseRepository<ContributionFile> {
  constructor() {
    super('Contribution file');
  }

  async findAll(): Promise<ContributionFile[]> {
    return await this.repository.find();
  }

  async findOneByIdWithRelations(id: number): Promise<ContributionFile> {
    const rs: ContributionFile | undefined = await this.repository.findOne(id, {
      relations: ['contribution'],
    });
    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(this.entityName),
      );
    }

    return rs;
  }
}
