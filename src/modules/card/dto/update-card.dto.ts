import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { CreateCardDto } from './create-card.dto';

export class CommentDto {
  @IsString()
  @Matches(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })
  userId: Types.ObjectId;

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
  description?: string;

  @IsString()
  cover?: string;

  @IsArray()
  memberIds: Types.ObjectId[];

  @IsArray()
  comments: CommentDto[];

  @IsString()
  columnId: Types.ObjectId;
}
