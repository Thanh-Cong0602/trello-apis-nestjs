import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtInfoDto } from '~/auth/dto/jwt-info';
import { ColumnService } from '~/modules/column/column.service';
import { CloudinaryProvider } from '~/providers/Cloudinary.provider';
import { BaseServiceAbstract } from '~/services/base.abstract.service';
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';
import { CreateCardDto } from './dto/create-card.dto';
import { CommentDto, UpdateCardDto } from './dto/update-card.dto';
import { CardRepositoryInterface } from './interfaces/card.interface';
import { Card, CardDocument } from './schemas/card.schema';
import { IncomingUserInfoType } from './types/incoming-user-info';
import { UpdateCardType } from './types/update-card.type';

@Injectable()
export class CardService extends BaseServiceAbstract<Card, CreateCardDto, UpdateCardDto> {
  constructor(
    @Inject(forwardRef(() => ColumnService))
    private readonly columnService: ColumnService,
    @Inject('CardRepositoryInterface')
    private readonly cardRepository: CardRepositoryInterface
  ) {
    super(cardRepository);
  }

  async create(createCardDto: CreateCardDto): Promise<CardDocument> {
    const transformedDto: CreateCardDto = {
      ...createCardDto,
      boardId: new Types.ObjectId(createCardDto.boardId),
      columnId: new Types.ObjectId(createCardDto.columnId)
    };

    const createdCard = await this.cardRepository.create(transformedDto);

    const getNewCard = await this.cardRepository.findOneById(createdCard._id.toString());

    if (getNewCard) await this.columnService.pushCardOrderIds(getNewCard);

    return createdCard;
  }

  async update(
    _cardId: string,
    updateCardDto: Partial<UpdateCardDto>
  ): Promise<CardDocument | null> {
    return await this.cardRepository.update(_cardId, updateCardDto);
  }

  async updateCard(
    _cardId: string,
    _updateCardBody: UpdateCardType,
    _userInfo: JwtInfoDto,
    cardCoverFile?: Express.Multer.File
  ) {
    const updatedData = { ..._updateCardBody, updatedAt: Date.now() };

    let updatedCard: CardDocument | null = null;

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'card-covers'
      );
      await this.cardRepository.update(_cardId, { cover: uploadResult.secure_url });
    } else if (updatedData.commentToAdd) {
      const commentData: CommentDto = {
        ...updatedData.commentToAdd,
        userId: new Types.ObjectId(_userInfo._id),
        userEmail: _userInfo.email,
        commentedAt: Date.now()
      };

      updatedCard = await this.cardRepository.unshiftNewComment(_cardId, commentData);
    } else if (updatedData.incomingUserInfo) {
      updatedCard = await this.updateMembers(_cardId, updatedData.incomingUserInfo);
    } else {
      const transformData = {
        ...updatedData,
        boardId: new Types.ObjectId(updatedData.boardId),
        columnId: new Types.ObjectId(updatedData.columnId)
      };
      updatedCard = await this.cardRepository.update(_cardId, transformData);
    }

    return updatedCard;
  }

  async updateMembers(
    _cardId: string,
    incomingUserInfo: IncomingUserInfoType
  ): Promise<CardDocument | null> {
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

    return await this.cardRepository.update(_cardId, updateCondition);
  }

  async deleteManyByColumnId(_columnId: string) {
    await this.cardRepository.deleteManyByColumnId(_columnId);
  }
}
