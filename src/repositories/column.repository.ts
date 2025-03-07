import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardDocument } from '~/modules/card/schemas/card.schema';
import { CreateColumnInternalDto } from '~/modules/column/dto/create-column.dto';
import { UpdateColumnDto } from '~/modules/column/dto/update-column.dto';
import { ColumnRepositoryInterface } from '~/modules/column/interfaces/column.interface';
import { Column, ColumnDocument } from '~/modules/column/schemas/column.schema';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class ColumnRepository
  extends BaseRepositoryAbstract<Column, CreateColumnInternalDto, UpdateColumnDto>
  implements ColumnRepositoryInterface
{
  constructor(
    @InjectModel(Column.name)
    private readonly columnModel: Model<Column>
  ) {
    super(columnModel);
  }

  async pushCardOrderIds(card: CardDocument): Promise<ColumnDocument | null> {
    return await this.columnModel.findOneAndUpdate(
      { _id: card.columnId },
      { $push: { cardOrderIds: card._id } },
      { returnDocument: 'after' }
    );
  }
}
