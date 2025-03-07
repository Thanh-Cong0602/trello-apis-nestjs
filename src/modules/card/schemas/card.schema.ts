import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '~/modules/shared/base/base.schema';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators';

export type CardDocument = HydratedDocument<Card>;

class Comment {
  @Prop({
    validate: {
      validator: (value: Types.ObjectId) => OBJECT_ID_RULE.test(value.toString()),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    match: [EMAIL_RULE, EMAIL_RULE_MESSAGE]
  })
  userEmail: string;

  @Prop()
  userAvatar: string;

  @Prop()
  userDisplayName: string;

  @Prop()
  content: string;

  @Prop()
  commentedAt: Date;
}

@Schema({ timestamps: true }) // Automation add createdAt và updatedAt
export class Card extends BaseSchema {
  @Prop({
    type: Types.ObjectId,
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => OBJECT_ID_RULE.test(value.toString()),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  boardId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => OBJECT_ID_RULE.test(value.toString()),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  columnId: Types.ObjectId;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: null })
  cover: string;

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

  @Prop({
    type: [Comment],
    default: []
  })
  comments: Comment[];
}

export const CardSchema = SchemaFactory.createForClass(Card);
