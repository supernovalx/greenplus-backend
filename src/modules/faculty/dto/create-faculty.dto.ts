import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
