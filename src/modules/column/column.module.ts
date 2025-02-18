import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '../board/board.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { Column, ColumnSchema } from './schemas/column.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]), BoardModule],
  controllers: [ColumnController],
  providers: [ColumnService]
})
export class ColumnModule {}
