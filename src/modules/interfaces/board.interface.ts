import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { CreateBoardInternalDto } from '../board/dto/create-board.dto';
import { UpdateBoardDto } from '../board/dto/update-board.dto';
import { BoardDocument } from '../board/schemas/board.schema';
import { BoardDetailsType } from '../board/types/board-details.type';
import { BoardType } from '../board/types/board.type';
import { ListBoardAggregatedResult } from '../board/types/list-boards.type';
import { ColumnDocument } from '../column/schemas/column.schema';
import { ColumnType } from '../column/types/column.type';

export interface BoardRepositoryInterface
  extends BaseRepositoryInterface<BoardDocument, CreateBoardInternalDto, UpdateBoardDto> {
  getDetails(userId: string, boardId: string): Promise<BoardDetailsType[] | null>;

  getBoards(
    userId: string,
    page: number,
    itemPerPage: number
  ): Promise<ListBoardAggregatedResult[] | null>;

  pushColumnOrderIds(column: ColumnType): Promise<BoardType | null>;

  pullColumnOrderIds(column: ColumnDocument): Promise<BoardType | null>;

  pushMemberIds(_boardId: string, _userId: string): Promise<BoardDocument | null>;
}
