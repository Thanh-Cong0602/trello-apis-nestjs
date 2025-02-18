import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardService } from '../board/board.service';
import { ColumnDto } from './dto/column.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './schemas/column.schema';

@Injectable()
export class ColumnService {
  @InjectModel(Column.name) private columnModel: Model<Column>;
  constructor(private readonly boardService: BoardService) {}

  async create(createColumnDto: CreateColumnDto) {
    const createdColumn = await this.columnModel.create(createColumnDto);
    const getNewColumn = await this.findOneById(createdColumn._id.toString());

    if (getNewColumn) {
      const columnObject: ColumnDto = {
        ...getNewColumn,
        _id: getNewColumn._id.toString()
      };

      columnObject.cards = [];
      await this.boardService.pushColumnOrderIds(columnObject);
    }

    return getNewColumn;
  }

  async findOneById(columnId: string) {
    const column = await this.columnModel.findOne({ _id: columnId });
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

    /* TODO: Delete Cards */

    /* Xóa Column Id trong mảng ColumnOrderIds chứa nó */
    await this.boardService.pullColumnOrderIds({
      ...targetColumn,
      _id: targetColumn._id.toString()
    });

    return { deleteResult: 'Column and its Cards deleted successfully!' };
  }

  async deleteOneById(_columnId: string) {
    return this.columnModel.findByIdAndDelete(_columnId);
  }
}
