import { BoardType } from './board.type';

export type ListBoardAggregatedResult = {
  queryBoards: BoardType[];
  queryTotalBoards: { countAllBoards: number }[];
};

export type ListBoardsType = {
  boards: BoardType[];

  totalBoards: number;
};
