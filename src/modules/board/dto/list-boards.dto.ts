import { BoardDto } from './board.dto';

export type ListBoardsDto = {
  boards: BoardDto[];

  totalBoards: number;
};
