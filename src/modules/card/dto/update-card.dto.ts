import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsNumber, IsString, Matches } from 'class-validator';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { CreateCardDto } from './create-card.dto';

class CommentDto {
  @IsString()
  @Matches(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })
  userId: string;

  @IsString()
  userEmail: string;

  @IsString()
  userAvatar: string;

  @IsString()
  userDisplayName: string;

  @IsString()
  content: string;

  @IsNumber()
  commentedAt: number;
}

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsString()
  description: string;

  @IsString()
  cover: string;

  @IsArray()
  memberIds: string[];

  @IsArray()
  comments: CommentDto[];

  @IsBoolean()
  _destroy: boolean;
}
