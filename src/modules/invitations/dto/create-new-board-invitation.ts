import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewBoardInvitationDto {
  @IsNotEmpty()
  @IsString()
  inviteeEmail: string;

  @IsNotEmpty()
  @IsString()
  boardId: string;
}

export class CreateInternalNewBoardInvitationDto {}
