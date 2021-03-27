import { ApiProperty } from '@nestjs/swagger';

export class AddContributionFilesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}
