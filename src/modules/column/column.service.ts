import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BoardService } from '../board/board.service';
import { CardService } from '../card/card.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './schemas/column.schema';
import { ColumnType } from './types/column.type';

@Injectable()
export class ColumnService {
  @InjectModel(Column.name) private columnModel: Model<Column>;
  constructor(
    private readonly boardService: BoardService,
    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService
  ) {}

  async create(createColumnDto: CreateColumnDto) {
    const createdColumn = await this.columnModel.create(createColumnDto);

    const getNewColumn = await this.findOneById(createdColumn._id.toString());

    if (getNewColumn) {
      const columnObject: ColumnType = { ...getNewColumn, cards: [] };
      await this.boardService.pushColumnOrderIds(columnObject);
    }

    return getNewColumn;
  }

  async findOneById(_columnId: string) {
    const column = await this.columnModel.findOne({ _id: _columnId });
    if (!column) throw new NotFoundException('Column not found!');
    return column;
  }

  async update(_columnId: string, _updateColumnDto: UpdateColumnDto) {
    return this.columnModel.findByIdAndUpdate(
      { _id: _columnId },
      { $set: _updateColumnDto },
      { returnDocument: 'after' }
    );
  }

  async remove(_columnId: string) {
    const targetColumn = await this.findOneById(_columnId);
    if (!targetColumn) throw new NotFoundException('Column not found!');

    /* Xóa Column */
    await this.deleteOneById(_columnId);

    /* Delete Cards */
    await this.cardService.deleteManyByColumnId(_columnId);

    /* Xóa Column Id trong mảng ColumnOrderIds chứa nó */
    await this.boardService.pullColumnOrderIds(targetColumn);

    return { deleteResult: 'Column and its Cards deleted successfully!' };
  }

  async deleteOneById(_columnId: string) {
    return this.columnModel.findByIdAndDelete(_columnId);
  }

  async pushCardOrderIds(_cardId: Types.ObjectId) {
    await this.columnModel.findOneAndUpdate(
      { _id: _cardId },
      { $push: { cardOrderIds: _cardId } },
      { returnDocument: 'after' }
    );
  }
}
