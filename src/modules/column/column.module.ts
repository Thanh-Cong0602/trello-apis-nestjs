import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '../board/board.module';
import { CardModule } from '../card/card.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { Column, ColumnSchema } from './schemas/column.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
    BoardModule,
    forwardRef(() => CardModule)
  ],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService]
})
export class ColumnModule {}
