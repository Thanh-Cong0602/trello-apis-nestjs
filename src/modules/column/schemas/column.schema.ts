import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '~/modules/shared/base/base.schema';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export type ColumnDocument = HydratedDocument<Column>;

@Schema({ timestamps: true })
export class Column extends BaseSchema {
  @Prop({
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => Types.ObjectId.isValid(value),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  boardId: Types.ObjectId;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  })
  title: string;

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
  cardOrderIds: Types.ObjectId[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
