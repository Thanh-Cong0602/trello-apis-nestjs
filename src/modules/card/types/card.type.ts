import { Types } from 'mongoose';
import { CommentType } from './comment.type';

export type CardType<T = string, D = number> = {
  _id: T;

  boardId: Types.ObjectId;

  columnId: Types.ObjectId;

  title: string;

  description?: string;

  cover: string | null;

  memberIds: Types.ObjectId[] | [];

  comments?: CommentType[] | [];

  createdAt?: D | null;

  updatedAt?: D | null;

  _destroy: boolean;
};
