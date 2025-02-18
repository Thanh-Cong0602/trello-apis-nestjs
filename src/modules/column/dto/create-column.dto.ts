import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export class CreateColumnDto {
  @IsNotEmpty()
  @IsString()
  @Matches(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })
  boardId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;
}
