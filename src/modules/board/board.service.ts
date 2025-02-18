import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pagingSkipValue } from '~/utils/algorithms';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';
import { slugify } from '~/utils/formatters';
import { ColumnDto } from '../column/dto/column.dto';
import { BoardDto } from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { ListBoardsDto } from './dto/list-boards.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './schemas/board.schema';

@Injectable()
export class BoardService {
  @InjectModel(Board.name) private boardModel: Model<Board>;

  async create(userId: string, createBoardDto: CreateBoardDto) {
    const newBoardToAdd = {
      ...createBoardDto,
      slug: slugify(createBoardDto.title),
      ownerIds: [new Types.ObjectId(userId)]
    };

    return await this.boardModel.create(newBoardToAdd);
  }

  async findOneById(boardId: string) {
    const board = await this.boardModel.findOne({ _id: boardId });
    if (!board) throw new NotFoundException('Board not found!');
    return board;
  }

  update(_id: string, _updateBoardDto: UpdateBoardDto) {
    return this.boardModel.findOneAndUpdate(
      { _id },
      { $set: _updateBoardDto },
      { returnDocument: 'after' }
    );
  }

  async getBoards(userId: string, page: number, itemPerPage: number): Promise<ListBoardsDto> {
    if (!page) page = DEFAULT_PAGE;
    if (!itemPerPage) itemPerPage = DEFAULT_ITEMS_PER_PAGE;
    const queryConditions = [
      { _destroy: false },
      {
        $or: [{ ownerIds: { $all: [userId] } }, { memberIds: { $all: [userId] } }]
      }
    ];

    type AggregatedResult = {
      queryBoards: BoardDto[];
      queryTotalBoards: { countAllBoards: number }[];
    };

    const query: AggregatedResult[] = await this.boardModel.aggregate(
      [
        { $match: { $and: queryConditions } },
        { $sort: { title: 1 } },
        {
          $facet: {
            queryBoards: [
              { $skip: pagingSkipValue(page, itemPerPage) },
              {
                $limit: itemPerPage
              }
            ],
            queryTotalBoards: [{ $count: 'countAllBoards' }]
          }
        }
      ],
      { collation: { locale: 'en' } }
    );
    const results = query[0];
    return {
      boards: results.queryBoards || [],
      totalBoards: results.queryTotalBoards[0]?.countAllBoards || 0
    };
  }

  async pushColumnOrderIds(column: ColumnDto) {
    return await this.boardModel.findOneAndUpdate(
      { _id: column.boardId },
      { $push: { columnOrderIds: column._id } },
      { returnDocument: 'after' }
    );
  }

  async pullColumnOrderIds(column: ColumnDto) {
    return await this.boardModel.findOneAndUpdate(
      { _id: column.boardId },
      { $pull: { columnOrderIds: column._id } },
      { returnDocument: 'after' }
    );
  }
}
