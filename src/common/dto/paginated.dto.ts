import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  total: number;

  limit: number;

  offset: number;

  @ApiHideProperty()
  results: TData[];
}
