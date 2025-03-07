import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '~/auth/auth.service';
import { BoardRepository } from '~/repositories/board.repository';
import { CardModule } from '../card/card.module';
import { ColumnModule } from '../column/column.module';
import { UserModule } from '../user/user.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board, BoardSchema } from './schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    UserModule,
    CardModule,
    forwardRef(() => ColumnModule)
  ],
  controllers: [BoardController],
  providers: [
    BoardService,
    AuthService,
    JwtService,
    { provide: 'BoardRepositoryInterface', useClass: BoardRepository }
  ],
  exports: [BoardService, MongooseModule]
})
export class BoardModule {}
