import { IsNumber, IsString } from 'class-validator';

export class ClientMessageDto {
  @IsString()
  message: string;

  @IsNumber()
  receiverId: number;
}
