import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '~/modules/shared/base/base.schema';
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

export type InvitationDocument = HydratedDocument<Invitation>;

class BoardInvitation {
  @Prop({
    validate: {
      validator: (value: Types.ObjectId) => OBJECT_ID_RULE.test(value.toString()),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  boardId: Types.ObjectId;

  @Prop({
    required: true,
    enum: BOARD_INVITATION_STATUS
  })
  status: string;
}

@Schema({ timestamps: true })
export class Invitation extends BaseSchema {
  @Prop({
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => OBJECT_ID_RULE.test(value.toString()),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  inviterId: Types.ObjectId;

  @Prop({
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => Types.ObjectId.isValid(value),
      message: OBJECT_ID_RULE_MESSAGE
    }
  })
  inviteeId: Types.ObjectId;

  @Prop({
    required: true,
    enum: INVITATION_TYPES
  })
  type: string;

  @Prop()
  boardInvitation: BoardInvitation;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
