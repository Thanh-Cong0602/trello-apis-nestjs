import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
  @Prop({ default: false })
  _destroy: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
