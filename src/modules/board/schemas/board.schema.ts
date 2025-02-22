import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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
    enum: BOARD_TYPES
  })
  type: string;

  @Prop({
    type: [Types.ObjectId],
    default: [],
    validate: {
      validator: (value: Types.ObjectId[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id.toString()));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  columnOrderIds: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    default: [],
    validate: {
      validator: (value: Types.ObjectId[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id.toString()));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  ownerIds: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    default: [],
    validate: {
      validator: (value: Types.ObjectId[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id.toString()));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  memberIds: Types.ObjectId[];

  @Prop({ default: false })
  _destroy: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
