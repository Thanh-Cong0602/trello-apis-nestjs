import { Types } from 'mongoose';

export type ColumnType = {
  _id: Types.ObjectId;

  boardId: Types.ObjectId;

  title: string;

  cardOrderIds: Types.ObjectId[];

  cards?: [];

  createdAt?: Date | null;

  updatedAt?: Date | null;

  _destroy: boolean;
};
