import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { CreateCardDto } from '../dto/create-card.dto';
import { CommentDto, UpdateCardDto } from '../dto/update-card.dto';
import { CardDocument } from '../schemas/card.schema';

export interface CardRepositoryInterface
  extends BaseRepositoryInterface<CardDocument, CreateCardDto, UpdateCardDto> {
  unshiftNewComment(_cardId: string, commentData: CommentDto): Promise<CardDocument | null>;

  deleteManyByColumnId(_columnId: string);
}
