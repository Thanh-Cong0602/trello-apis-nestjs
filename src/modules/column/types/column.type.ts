import { Types } from 'mongoose';
import { CardType } from '~/modules/card/types/card.type';

export type ColumnType = {
  _id: Types.ObjectId;

  boardId: Types.ObjectId;

  title: string;

  cardOrderIds: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;

  _destroy: boolean;

  cards: CardType[];
};
