import { CardType } from '~/modules/card/types/card.type';
import { ColumnType } from '~/modules/column/types/column.type';
import { UserResponseType } from '~/modules/user/types/user.type';
import { BoardType } from './board.type';

export type BoardDetailsType = BoardType & {
  columns: ColumnType[];

  cards?: CardType[];

  owners: UserResponseType[];

  members: UserResponseType[];
};
