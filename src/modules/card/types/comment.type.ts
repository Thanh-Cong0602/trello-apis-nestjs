import { Types } from 'mongoose';

export type CommentType<T = Types.ObjectId, D = Date> = {
  userId: T;

  userEmail: string;

  userAvatar: string;

  userDisplayName: string;

  content: string;

  commentedAt: D;
};
