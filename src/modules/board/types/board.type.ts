import { Types } from 'mongoose';

export type BoardType = {
  _id: Types.ObjectId;

  title: string;

  slug: string;

  description: string;

  type: string;

  columnOrderIds: Types.ObjectId[] | [];

  ownerIds: Types.ObjectId[] | [];

  memberIds: Types.ObjectId[] | [];

  createdAt: Date;

  updatedAt: Date;

  _destroy: boolean;
};
