import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board } from '~/modules/board/schemas/board.schema';
import { CreateInvitationDto } from '~/modules/invitations/dto/create-invitation.dto';
import { UpdateInvitationDto } from '~/modules/invitations/dto/update-invitation.dto';
import { InvitationRepositoryInterface } from '~/modules/invitations/interfaces/invitation.interface';
import { Invitation } from '~/modules/invitations/schemas/invitation.schema';
import { InvitationsType } from '~/modules/invitations/types/invitations.type';
import { User } from '~/modules/user/schemas/user.schema';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class InvitationRepository
  extends BaseRepositoryAbstract<Invitation, CreateInvitationDto, UpdateInvitationDto>
  implements InvitationRepositoryInterface
{
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<Invitation>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Board.name)
    private readonly boardModel: Model<Board>
  ) {
    super(invitationModel);
  }

  async findByUser(_userId: string): Promise<InvitationsType[] | null> {
    const queryConditions = [{ inviteeId: new Types.ObjectId(_userId) }, { _destroy: false }];

    const result: InvitationsType[] = await this.invitationModel
      .aggregate([
        { $match: { $and: queryConditions } },
        {
          $lookup: {
            from: this.userModel.collection.name,
            localField: 'inviterId',
            foreignField: '_id',
            as: 'inviter',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: this.userModel.collection.name,
            localField: 'inviteeId',
            foreignField: '_id',
            as: 'invitee',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: this.boardModel.collection.name,
            localField: 'boardInvitation.boardId',
            foreignField: '_id',
            as: 'board'
          }
        }
      ])
      .exec();

    return result;
  }
}
