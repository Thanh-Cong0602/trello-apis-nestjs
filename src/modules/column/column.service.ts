import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CardDocument } from '~/modules/card/schemas/card.schema';
import { BaseServiceAbstract } from '~/services/base.abstract.service';
import { BoardService } from '../board/board.service';
import { CardService } from '../card/card.service';
import { CreateColumnDto, CreateColumnInternalDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnRepositoryInterface } from './interfaces/column.interface';
import { ColumnDocument } from './schemas/column.schema';
import { ColumnType } from './types/column.type';

@Injectable()
export class ColumnService extends BaseServiceAbstract<
  ColumnDocument,
  CreateColumnDto,
  UpdateColumnDto
> {
  constructor(
    private readonly boardService: BoardService,

    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService,

    @Inject('ColumnRepositoryInterface')
    private readonly columnRepository: ColumnRepositoryInterface
  ) {
    super(columnRepository);
  }

  async createColumn(createColumnDto: CreateColumnDto) {
    const newColumnToAdd: CreateColumnInternalDto = {
      ...createColumnDto,
      boardId: new Types.ObjectId(createColumnDto.boardId)
    };

    const createdColumn = await this.columnRepository.create(newColumnToAdd);

    const getNewColumn = await this.columnRepository.findOneById(createdColumn._id.toString());

    if (getNewColumn) {
      const columnObject: ColumnType = { ...getNewColumn, cards: [] };
      await this.boardService.pushColumnOrderIds(columnObject);
    }

    return getNewColumn;
  }

  async update(_columnId: string, _updateColumnDto: UpdateColumnDto) {
    return this.columnRepository.update(_columnId, _updateColumnDto);
  }

  async removeColumn(_columnId: string) {
    const targetColumn = await this.columnRepository.findOneById(_columnId);

    if (!targetColumn) throw new NotFoundException('Column not found!');

    /* Delete Column */
    await this.columnRepository.permanentlyDelete(_columnId);

    /* Delete Cards */
    await this.cardService.deleteManyByColumnId(_columnId);

    /* Xóa Column Id trong mảng ColumnOrderIds chứa nó */
    await this.boardService.pullColumnOrderIds(targetColumn);

    return { deleteResult: 'Column and its Cards deleted successfully!' };
  }

  async pushCardOrderIds(card: CardDocument) {
    return await this.columnRepository.pushCardOrderIds(card);
  }
}
