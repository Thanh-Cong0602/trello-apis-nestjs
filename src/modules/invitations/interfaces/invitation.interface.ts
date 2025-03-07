import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { CreateInvitationDto } from '../dto/create-invitation.dto';
import { UpdateInvitationDto } from '../dto/update-invitation.dto';
import { InvitationDocument } from '../schemas/invitation.schema';
import { InvitationsType } from '../types/invitations.type';

export interface InvitationRepositoryInterface
  extends BaseRepositoryInterface<InvitationDocument, CreateInvitationDto, UpdateInvitationDto> {
  findByUser(_userId: string): Promise<InvitationsType[] | null>;
}
