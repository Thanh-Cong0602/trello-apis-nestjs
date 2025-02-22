import { Global, Module } from '@nestjs/common';
import { CardService } from './modules/card/card.service';
import { ColumnService } from './modules/column/column.service';

@Global()
@Module({
  providers: [ColumnService, CardService],
  exports: [ColumnService, CardService]
})
export class CoreModule {}
