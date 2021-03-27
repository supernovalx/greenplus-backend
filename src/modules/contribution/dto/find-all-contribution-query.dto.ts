import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderType } from 'src/common/enums/order-types';

export class FindAllContributionQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsBooleanString()
  isPublished?: boolean;

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
