import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderType } from 'src/common/enums/order-types';

export class FindAllFacultyQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @IsOptional()
  @IsEnum(OrderType)
  createAtOrderType?: OrderType;
}
