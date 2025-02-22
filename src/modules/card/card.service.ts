import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtInfoDto } from '~/auth/dto/jwt-info';
import { ColumnService } from '~/modules/column/column.service';
import { CloudinaryProvider } from '~/providers/Cloudinary.provider';
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './schemas/card.schema';
import { CommentType } from './types/comment.type';
import { IncomingUserInfoType } from './types/incoming-user-info';
import { UpdateCardType } from './types/update-card.type';

@Injectable()
export class CardService {
  @InjectModel(Card.name) private cardModel: Model<Card>;
  constructor(
    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService
  ) {}

  async create(createCardDto: CreateCardDto) {
    const createdCard = await this.cardModel.create(createCardDto);

    const getNewCard = await this.findOneById(createdCard._id.toString());

    if (getNewCard) await this.columnService.pushCardOrderIds(getNewCard._id);

    return getNewCard;
  }

  async findOneById(_cardId: string) {
    const card = await this.cardModel.findOne({ _id: _cardId });
    if (!card) throw new NotFoundException('Card not found!');
    return card;
  }

  async update(
    _cardId: string,
    _updateCardBody: UpdateCardType,
    _userInfo: JwtInfoDto,
    cardCoverFile?: Express.Multer.File
  ) {
    const updatedData = { ..._updateCardBody, updatedAt: Date.now() };

    let updatedCard: UpdateCardDto | null = null;

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'card-covers'
      );
      await this.updateCard(_cardId, { cover: uploadResult.secure_url });
    } else if (updatedData.commentToAdd) {
      const commentData: CommentType = {
        ...updatedData.commentToAdd,
        commentedAt: Date.now(),
        userId: _userInfo._id,
        userEmail: _userInfo.email
      };

      updatedCard = await this.unshiftNewComment(_cardId, commentData);
    } else if (updatedData.incomingUserInfo) {
      updatedCard = await this.updateMembers(_cardId, updatedData.incomingUserInfo);
    } else {
      updatedCard = await this.updateCard(_cardId, updatedData);
    }

    return updatedCard;
  }

  async updateCard(
    _cardId: string,
    updatedCard: Partial<UpdateCardType>
  ): Promise<UpdateCardDto | null> {
    const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];
    Object.keys(updatedCard).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updatedCard[fieldName];
    });

    return await this.cardModel.findOneAndUpdate(
      { _id: _cardId },
      { $set: updatedCard },
      { returnDocument: 'after' }
    );
  }

  async unshiftNewComment(
    _cardId: string,
    commentData: CommentType
  ): Promise<UpdateCardDto | null> {
    return await this.cardModel.findOneAndUpdate(
      { _id: _cardId },
      { $push: { comments: { $each: [commentData], $position: 0 } } },
      { returnDocument: 'after' }
    );
  }

  async updateMembers(
    _cardId: string,
    incomingUserInfo: IncomingUserInfoType
  ): Promise<UpdateCardDto | null> {
    let updateCondition = {};

    if (incomingUserInfo.action === CARD_MEMBER_ACTIONS.ADD) {
      updateCondition = {
        $push: { memberIds: incomingUserInfo.userId }
      };
    }

    if (incomingUserInfo.action === CARD_MEMBER_ACTIONS.REMOVE) {
      updateCondition = {
        $pull: { memberIds: incomingUserInfo.userId }
      };
    }

    return await this.cardModel.findOneAndUpdate(
      {
        _id: _cardId
      },
      updateCondition,
      {
        returnDocument: 'after'
      }
    );
  }

  async deleteManyByColumnId(_columnId: string) {
    await this.cardModel.deleteMany({ _id: _columnId });
  }
}
