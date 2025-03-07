import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '~/modules/shared/base/base.schema';
import { USERS_ROLES } from '~/utils/constants';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({
    required: true,
    unique: true,
    match: [EMAIL_RULE, EMAIL_RULE_MESSAGE]
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    trim: true
  })
  username: string;

  @Prop({
    required: true,
    trim: true
  })
  displayName: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({
    required: true,
    enum: USERS_ROLES,
    default: USERS_ROLES.CLIENT
  })
  role: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  verifyToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
