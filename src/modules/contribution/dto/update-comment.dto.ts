import { IsNotEmpty, MaxLength } from 'class-validator';
import { Constrains } from 'src/common/const/constraint';

export class UpdateCommentDto {
  @IsNotEmpty()
  @MaxLength(Constrains.STRING_MAX_LEN)
  comment: string;
}
