import { Types } from 'mongoose';

export type BoardType = {
  _id: Types.ObjectId;

  title: string;

  slug: string;

  description: string;

  type: string;

  columnOrderIds: string[];

  ownerIds: string[];

  memberIds: string[];

  createdAt?: Date | null;

  updatedAt?: number | null;

  _destroy: boolean;
};
