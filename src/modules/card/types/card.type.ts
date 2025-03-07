import { Types } from 'mongoose';
import { CommentType } from './comment.type';

export type CardType<T = Types.ObjectId, D = Date> = {
  _id: T;

  boardId: T;

  columnId: T;

  title: string;

  description?: string;

  cover?: string;

  memberId: T[] | [];

  createdAt: D;

  updatedAt: D;

  _destroy: boolean;

  comments?: CommentType<T, D>;
};
