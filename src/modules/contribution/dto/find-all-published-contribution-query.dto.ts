import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderType } from 'src/common/enums/order-types';

export class FindAllPublishedContributionQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  authorId?: number;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  facultyId?: number;

  @IsOptional()
  @IsEnum(OrderType)
  viewOrderType?: OrderType;
}
