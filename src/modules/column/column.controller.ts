import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '~/auth/passport/jwt-auth.guard';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnService.createColumn(createColumnDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(id, updateColumnDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.columnService.removeColumn(id);
  }
}
