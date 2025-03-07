import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCardDto } from '~/modules/card/dto/create-card.dto';
import { CardRepositoryInterface } from '~/modules/card/interfaces/card.interface';
import { Card, CardDocument } from '~/modules/card/schemas/card.schema';
import { CommentDto, UpdateCardDto } from './../modules/card/dto/update-card.dto';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class CardRepository
  extends BaseRepositoryAbstract<CardDocument, CreateCardDto, UpdateCardDto>
  implements CardRepositoryInterface
{
  constructor(
    @InjectModel(Card.name)
    private readonly cardModel: Model<CardDocument>
  ) {
    super(cardModel);
  }

  async update(_id: string, updateDto: Partial<UpdateCardDto>) {
    const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];
    const filteredUpdate = { ...updateDto };
    INVALID_UPDATE_FIELDS.forEach(field => delete filteredUpdate[field]);

    return super.update(_id, filteredUpdate);
  }

  async unshiftNewComment(_cardId: string, commentData: CommentDto): Promise<CardDocument | null> {
    return await this.cardModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_cardId) },
      { $push: { comments: { $each: [commentData], $position: 0 } } },
      { returnDocument: 'after' }
    );
  }

  async deleteManyByColumnId(_columnId: string) {
    await this.cardModel.deleteMany({ columnId: new Types.ObjectId(_columnId) });
  }
}
