import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BOARD_TYPES } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Board {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  })
  title: string;

  @Prop({
    required: true,
    minlength: 3,
    trim: true
  })
  slug: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 256,
    trim: true
  })
  description: string;

  @Prop({
    required: true,
    type: String,
    enum: BOARD_TYPES
  })
  type: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (value: string[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  columnOrderIds: string[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (value: string[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  ownerIds: string[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (value: string[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  memberIds: string[];

  @Prop({
    type: Boolean,
    default: false
  })
  _destroy: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
