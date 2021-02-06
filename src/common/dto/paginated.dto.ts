import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  total: number;

  @ApiHideProperty()
  results: TData[];
}
