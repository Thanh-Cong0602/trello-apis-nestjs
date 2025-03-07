import { CardType } from './card.type';
import { CommentType } from './comment.type';
import { IncomingUserInfoType } from './incoming-user-info';

export type UpdateCardType = Omit<CardType<string, number>, 'comments'> & {
  commentToAdd?: CommentType<string, number>;

  incomingUserInfo: IncomingUserInfoType;
};
