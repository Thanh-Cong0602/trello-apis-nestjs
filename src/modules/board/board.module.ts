import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '~/auth/auth.service';
import { UserModule } from '../user/user.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board, BoardSchema } from './schemas/board.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]), UserModule],
  controllers: [BoardController],
  providers: [BoardService, AuthService, JwtService],
  exports: [BoardService]
})
export class BoardModule {}
