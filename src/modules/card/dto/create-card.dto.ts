import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export class CreateCardDto {
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string' && OBJECT_ID_RULE.test(value)) return new Types.ObjectId(value);

    throw new BadRequestException(OBJECT_ID_RULE_MESSAGE);
  })
  boardId: Types.ObjectId;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string' && OBJECT_ID_RULE.test(value)) return new Types.ObjectId(value);

    throw new BadRequestException(OBJECT_ID_RULE_MESSAGE);
  })
  columnId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;
}
