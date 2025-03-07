import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBoardInternalDto } from '~/modules/board/dto/create-board.dto';
import { UpdateBoardDto } from '~/modules/board/dto/update-board.dto';
import { Board, BoardDocument } from '~/modules/board/schemas/board.schema';
import { BoardDetailsType } from '~/modules/board/types/board-details.type';
import { ListBoardAggregatedResult } from '~/modules/board/types/list-boards.type';
import { Card } from '~/modules/card/schemas/card.schema';
import { Column, ColumnDocument } from '~/modules/column/schemas/column.schema';
import { ColumnType } from '~/modules/column/types/column.type';
import { BoardRepositoryInterface } from '~/modules/interfaces/board.interface';
import { User } from '~/modules/user/schemas/user.schema';
import { pagingSkipValue } from '~/utils/algorithms';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class BoardRepository
  extends BaseRepositoryAbstract<Board, CreateBoardInternalDto, UpdateBoardDto>
  implements BoardRepositoryInterface
{
  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<Board>,
    @InjectModel(Column.name)
    private readonly columnModel: Model<Column>,
    @InjectModel(Card.name)
    private readonly cardModel: Model<Card>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {
    super(boardModel);
  }

  async getDetails(userId: string, boardId: string): Promise<BoardDetailsType[] | null> {
    const queryConditions = [
      { _id: new Types.ObjectId(boardId) },
      { _destroy: false },
      {
        $or: [
          { ownerIds: { $all: [new Types.ObjectId(userId)] } },
          { memberIds: { $all: [new Types.ObjectId(userId)] } }
        ]
      }
    ];

    const result: BoardDetailsType[] = await this.boardModel
      .aggregate([
        { $match: { $and: queryConditions } },
        {
          $lookup: {
            from: this.columnModel.collection.name,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: this.cardModel.collection.name,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        },
        {
          $lookup: {
            from: this.userModel.collection.name,
            localField: 'ownerIds',
            foreignField: '_id',
            as: 'owners',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: this.userModel.collection.name,
            localField: 'memberIds',
            foreignField: '_id',
            as: 'members',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        }
      ])
      .exec();

    return result;
  }

  async getBoards(
    userId: string,
    page: number,
    itemPerPage: number
  ): Promise<ListBoardAggregatedResult[] | null> {
    if (!page) page = DEFAULT_PAGE;
    if (!itemPerPage) itemPerPage = DEFAULT_ITEMS_PER_PAGE;
    const queryConditions = [
      { _destroy: false },
      {
        $or: [{ ownerIds: { $all: [userId] } }, { memberIds: { $all: [userId] } }]
      }
    ];

    const result: ListBoardAggregatedResult[] = await this.boardModel
      .aggregate(
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
      )
      .exec();

    return result;
  }

  async pushColumnOrderIds(column: ColumnType): Promise<BoardDocument | null> {
    return await this.boardModel.findOneAndUpdate(
      { _id: column.boardId },
      { $push: { columnOrderIds: column._id } },
      { returnDocument: 'after' }
    );
  }

  async pullColumnOrderIds(column: ColumnDocument): Promise<BoardDocument | null> {
    return await this.boardModel.findOneAndUpdate(
      { _id: column.boardId },
      { $pull: { columnOrderIds: column._id } },
      { returnDocument: 'after' }
    );
  }

  async pushMemberIds(_boardId: string, _userId: string): Promise<BoardDocument | null> {
    return await this.boardModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_boardId) },
      { $push: { memberIds: new Types.ObjectId(_userId) } },
      { returnDocument: 'after' }
    );
  }
}
