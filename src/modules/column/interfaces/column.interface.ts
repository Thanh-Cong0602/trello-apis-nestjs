import { CardDocument } from '~/modules/card/schemas/card.schema';
import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { Column, ColumnDocument } from '../schemas/column.schema';

export interface ColumnRepositoryInterface
  extends BaseRepositoryInterface<ColumnDocument, CreateColumnDto, UpdateColumnDto> {
  pushCardOrderIds(card: CardDocument): Promise<Column | null>;
}
