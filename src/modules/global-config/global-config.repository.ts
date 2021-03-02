import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { EntityRepository, UpdateResult } from 'typeorm';
import { GlobalConfig } from './entities/global-config.entity';

@EntityRepository(GlobalConfig)
export class GlobalConfigRepository extends BaseRepository<GlobalConfig> {
  constructor() {
    super('GlobalConfig');
  }

  async get(key: string): Promise<string> {
    const rs: GlobalConfig | undefined = await this.repository.findOne({
      key: key,
    });
    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(`${this.entityName}:${key}`),
      );
    }

    return rs.value;
  }

  async set(key: string, value: string): Promise<void> {
    const updateResult: UpdateResult = await this.repository.update(
      { key: key },
      { value: value },
    );

    if (updateResult.affected !== 1) {
      throw new InternalServerErrorException(
        ExceptionMessage.FAILED.UPDATE_ENTITY(`${this.entityName}:${key}`),
      );
    }
  }
}
