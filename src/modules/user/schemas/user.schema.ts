import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USERS_ROLES } from '~/utils/constants';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => EMAIL_RULE.test(email),
      message: EMAIL_RULE_MESSAGE
    }
  })
  email: string;

  @Prop({
    required: true
  })
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

  @Prop({
    default: null
  })
  avatar: string;

  @Prop({
    required: true,
    enum: USERS_ROLES,
    default: USERS_ROLES.CLIENT
  })
  role: string;

  @Prop({
    default: false
  })
  isActive: boolean;

  @Prop()
  verifyToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({
    default: false
  })
  _destroy: boolean;

  private _id: string;

  get id(): string {
    return this._id.toString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
