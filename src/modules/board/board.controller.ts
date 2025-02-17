import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBoardDto: CreateBoardDto) {
    const userId = '650f7a9b9b0c6200dcaebfad';
    return this.boardService.create(userId, createBoardDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id') boardId: string) {
    return this.boardService.findOneById(boardId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getBoards(@Query('page') page: number, @Query('itemPerPage') itemPerPage: number) {
    const userId = '650f7a9b9b0c6200dcaebfad';
    return this.boardService.getBoards(userId, page, itemPerPage);
  }
}
