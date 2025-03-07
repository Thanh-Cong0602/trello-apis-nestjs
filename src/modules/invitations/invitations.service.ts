import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants';
import { BoardService } from '../board/board.service';
import { Board } from '../board/schemas/board.schema';
import { UserMapper } from '../user/user.mapper';
import { UserService } from './../user/user.service';
import { CreateNewBoardInvitationDto } from './dto/create-new-board-invitation';
import { InvitationRepositoryInterface } from './interfaces/invitation.interface';
import { UpdateBoardType } from './types/update-board.type';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly userService: UserService,

    private readonly boardService: BoardService,

    private readonly userMapper: UserMapper,

    @InjectModel(Board.name) private readonly boardModel: Model<Board>,

    @Inject('InvitationRepositoryInterface')
    private readonly invitationRepository: InvitationRepositoryInterface
  ) {}
  async createNewBoardInvitation(
    inviterId: string,
    createNewBoardInvitationDto: CreateNewBoardInvitationDto
  ) {
    const inviter = await this.userService.findOneById(inviterId);

    const invitee = await this.userService.findByEmail(createNewBoardInvitationDto.inviteeEmail);

    const board = await this.boardService.findOneById(createNewBoardInvitationDto.boardId);

    if (!inviter || !invitee || !board)
      throw new NotFoundException('Inviter, Invitee or Board not found');

    const newInvitationData = {
      inviterId: new Types.ObjectId(inviterId),
      inviteeId: new Types.ObjectId(invitee._id.toString()),
      type: INVITATION_TYPES.BOARD_INVITATION,

      boardInvitation: {
        boardId: new Types.ObjectId(board._id.toString()),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    };

    const createdInvitation = await this.invitationRepository.create(newInvitationData);

    const getInvitation = await this.invitationRepository.findOneById(
      createdInvitation._id.toString()
    );

    return {
      ...getInvitation,
      board,
      inviter: this.userMapper.mapEntityToDto(inviter),
      invitee: this.userMapper.mapEntityToDto(invitee)
    };
  }

  async getInvitations(_userId: string) {
    const getInvitations = await this.invitationRepository.findByUser(_userId);

    if (!getInvitations) throw new NotFoundException('No invitations found');

    const resInvitations = getInvitations.map(i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }));
    return resInvitations;
  }

  async updateBoardInvitation(
    _userId: string,
    _invitationId: string,
    updateBoardType: UpdateBoardType
  ) {
    const { status } = updateBoardType;

    const getInvitation = await this.invitationRepository.findOneById(_invitationId);

    if (!getInvitation) throw new NotFoundException('Invitation not found!');

    const boardId = getInvitation.boardInvitation.boardId;

    const getBoard = await this.boardService.findOneById(boardId.toString());

    if (!getBoard) throw new NotFoundException('Board not found!');

    const boardOwnerandMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString();

    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerandMemberIds.includes(_userId)) {
      throw new NotAcceptableException('You are already a member of this board!');
    }

    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    };

    const updatedInvitation = await this.invitationRepository.update(_invitationId, updateData);

    if (updatedInvitation?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await this.boardService.pushMemberIds(boardId.toString(), _userId);
    }

    return updatedInvitation;
  }
}
