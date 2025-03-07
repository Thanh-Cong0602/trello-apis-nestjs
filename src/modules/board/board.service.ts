import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { Types } from 'mongoose';
import { BaseServiceAbstract } from '~/services/base.abstract.service';
import { slugify } from '~/utils/formatters';
import { CardService } from '../card/card.service';
import { ColumnService } from '../column/column.service';
import { ColumnDocument } from '../column/schemas/column.schema';
import { ColumnType } from '../column/types/column.type';
import { BoardRepositoryInterface } from '../interfaces/board.interface';
import { CreateBoardDto, CreateBoardInternalDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardDocument } from './schemas/board.schema';
import { BoardDetailsType } from './types/board-details.type';
import { BoardType } from './types/board.type';
import { ListBoardsType } from './types/list-boards.type';
import { MovingCardType } from './types/moving-card.type';

@Injectable()
export class BoardService extends BaseServiceAbstract<
  BoardDocument,
  CreateBoardDto,
  UpdateBoardDto
> {
  constructor(
    @Inject('BoardRepositoryInterface')
    private readonly boardRepository: BoardRepositoryInterface,
    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService,
    private readonly cardService: CardService
  ) {
    super(boardRepository);
  }

  async createBoard(userId: string, createBoardDto: CreateBoardDto): Promise<BoardDocument> {
    const newBoardToAdd: CreateBoardInternalDto = {
      ...createBoardDto,
      slug: slugify(createBoardDto.title),
      ownerIds: [new Types.ObjectId(userId)]
    };

    return await this.boardRepository.create(newBoardToAdd);
  }

  async findOneById(boardId: string): Promise<BoardDocument | null> {
    return await this.boardRepository.findOneById(boardId);
  }

  async getBoards(userId: string, page: number, itemPerPage: number): Promise<ListBoardsType> {
    const results = await this.boardRepository.getBoards(userId, page, itemPerPage);

    if (!results || !results.length) {
      return { boards: [], totalBoards: 0 };
    }

    return {
      boards: results[0].queryBoards,
      totalBoards: results[0].queryTotalBoards[0]?.countAllBoards
    };
  }

  async getDetails(userId: string, _boardId: string): Promise<BoardDetailsType | null> {
    const result = await this.boardRepository.getDetails(userId, _boardId);

    if (!result || !result.length) throw new NotFoundException('Board not found!');

    const resBoard = cloneDeep(result[0]);

    resBoard.columns.forEach(column => {
      if (resBoard.cards) {
        column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id));
      } else {
        column.cards = [];
      }
    });

    delete resBoard.cards;

    return resBoard;
  }

  async pushColumnOrderIds(column: ColumnType): Promise<BoardType | null> {
    return this.boardRepository.pushColumnOrderIds(column);
  }

  async pullColumnOrderIds(column: ColumnDocument): Promise<BoardType | null> {
    return this.boardRepository.pullColumnOrderIds(column);
  }

  async moveCardToDifferentColumn(reqBody: MovingCardType) {
    /* Bước 1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó */
    await this.columnService.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds.map(c => new Types.ObjectId(c))
    });

    /* Bước 2: Cập nhật mảng cardOrderIds của Column tiếp theo */
    await this.columnService.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds.map(c => new Types.ObjectId(c))
    });

    /* Bước 3: Cập nhật lại trường ColumnId của cái Card đã kéo */
    await this.cardService.update(reqBody.currentCardId, {
      columnId: new Types.ObjectId(reqBody.nextColumnId)
    });

    return { updateResult: 'Successfully' };
  }

  async pushMemberIds(_boardId: string, _userId: string): Promise<BoardDocument | null> {
    return await this.boardRepository.pushMemberIds(_boardId, _userId);
  }
}
