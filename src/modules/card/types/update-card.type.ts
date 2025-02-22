import { CardType } from './card.type';
import { CommentType } from './comment.type';
import { IncomingUserInfoType } from './incoming-user-info';

export type UpdateCardType = CardType<string, number> & {
  commentToAdd: CommentType;

  incomingUserInfo: IncomingUserInfoType;
};
