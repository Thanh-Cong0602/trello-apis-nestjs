import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export type BoardDocument = HydratedDocument<Column>;

@Schema({ timestamps: true })
export class Column {
  @Prop({
    required: true,
    validate: {
      validator: (value: string[]) => {
        return value.every(id => OBJECT_ID_RULE.test(id));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  boardId: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  })
  title: string;

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
  cardOrderIds: string[];

  @Prop({
    type: Boolean,
    default: false
  })
  _destroy: boolean;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
