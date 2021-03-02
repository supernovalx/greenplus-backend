import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AbstractRepository,
  DeepPartial,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ExceptionMessage } from './const/exception-message';

export class BaseRepository<T> extends AbstractRepository<T> {
  protected entityName: string;
  constructor(entityName: string) {
    super();
    this.entityName = entityName;
  }
  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity: T = this.repository.create(createDto);

    return await this.repository.save(entity);
  }

  async findOneById(id: number): Promise<T> {
    const rs: T | undefined = await this.repository.findOne(id);

    if (rs === undefined) {
      throw new NotFoundException(
        ExceptionMessage.NOT_FOUND.ENTITY(this.entityName),
      );
    }

    return rs;
  }

  async updateOne(
    id: number,
    updateDto: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    const updateResult: UpdateResult = await this.repository.update(
      id,
      updateDto,
    );

    if (updateResult.affected !== 1) {
      throw new InternalServerErrorException(
        ExceptionMessage.FAILED.UPDATE_ENTITY(this.entityName),
      );
    }
  }

  async deleteOne(id: number): Promise<void> {
    const deleteResult: DeleteResult = await this.repository.delete(id);

    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(
        ExceptionMessage.FAILED.DELETE_ENTITY(this.entityName),
      );
    }
  }

  fromDto(dto: DeepPartial<T>): T {
    return this.repository.create(dto);
  }
}
