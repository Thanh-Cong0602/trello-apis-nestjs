import { BoardType } from '~/modules/board/types/board.type';
import { UserResponseType } from '~/modules/user/types/user.type';
import { InvitationDocument } from '../schemas/invitation.schema';

export type InvitationsType = Omit<InvitationDocument, keyof Document> & {
  inviter: UserResponseType;

  invitee: UserResponseType;

  board: BoardType;
};
