import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '~/auth/auth.module';
import { CardRepository } from '~/repositories/card.repository';
import { ColumnModule } from '../column/column.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card, CardSchema } from './schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    AuthModule,
    forwardRef(() => ColumnModule)
  ],
  controllers: [CardController],
  providers: [CardService, { provide: 'CardRepositoryInterface', useClass: CardRepository }],
  exports: [CardService, MongooseModule]
})
export class CardModule {}
