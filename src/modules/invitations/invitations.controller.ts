import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard } from '~/auth/passport/jwt-auth.guard';
import { CreateNewBoardInvitationDto } from './dto/create-new-board-invitation';
import { InvitationsService } from './invitations.service';
import { UpdateBoardType } from './types/update-board.type';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Post('/board')
  @HttpCode(HttpStatus.CREATED)
  createNewBoardInvitation(
    @Req() req: Request,
    @Body() createNewBoardInvitationDto: CreateNewBoardInvitationDto
  ) {
    const { _id } = this.authService.getUserFromToken(req);

    return this.invitationsService.createNewBoardInvitation(_id, createNewBoardInvitationDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Get()
  @HttpCode(HttpStatus.OK)
  getInvitations(@Req() req: Request) {
    const { _id } = this.authService.getUserFromToken(req);

    return this.invitationsService.getInvitations(_id);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Put('/board/:invitationId')
  @HttpCode(HttpStatus.OK)
  updateBoardInvitation(
    @Req() req: Request,
    @Param('invitationId') invitationId: string,
    @Body() updateBoardType: UpdateBoardType
  ) {
    const { _id } = this.authService.getUserFromToken(req);

    return this.invitationsService.updateBoardInvitation(_id, invitationId, updateBoardType);
  }
}
