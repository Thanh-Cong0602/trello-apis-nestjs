import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @Matches(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })
  boardId: string;

  @IsNotEmpty()
  @IsString()
  @Matches(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })
  columnId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;
}
