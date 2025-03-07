import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { CreateColumnDto } from './create-column.dto';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  cardOrderIds: Types.ObjectId[];
}
