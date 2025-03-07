import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '~/auth/auth.service';
import { BoardModule } from '~/modules/board/board.module';
import { UserModule } from '~/modules/user/user.module';
import { InvitationRepository } from '~/repositories/invitation.repository';
import { UserMapper } from '../user/user.mapper';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }]),
    UserModule,
    BoardModule
  ],
  controllers: [InvitationsController],
  providers: [
    InvitationsService,
    AuthService,
    JwtService,
    UserMapper,
    { provide: 'InvitationRepositoryInterface', useClass: InvitationRepository }
  ]
})
export class InvitationsModule {}
