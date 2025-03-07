import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { BOARD_TYPES_VALUES } from '~/utils/constants';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(356)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(BOARD_TYPES_VALUES)
  type: string;
}

export class CreateBoardInternalDto extends CreateBoardDto {
  slug: string;
  ownerIds: Types.ObjectId[];
}
