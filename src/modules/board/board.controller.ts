import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard } from '~/auth/passport/jwt-auth.guard';
import { Public } from '~/decorator/customize';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MovingCardType } from './types/moving-card.type';

@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request, @Body() createBoardDto: CreateBoardDto) {
    const { _id } = this.authService.getUserFromToken(req);

    return this.boardService.createBoard(_id, createBoardDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Get()
  @HttpCode(HttpStatus.OK)
  getBoards(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('itemPerPage') itemPerPage: number
  ) {
    const { _id: userId } = this.authService.getUserFromToken(req);
    return this.boardService.getBoards(userId, page, itemPerPage);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getDetails(@Req() req: Request, @Param('id') boardId: string) {
    const { _id: userId } = this.authService.getUserFromToken(req);
    return this.boardService.getDetails(userId, boardId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Private API
  @Put('/supports/moving_card')
  @HttpCode(HttpStatus.OK)
  moveCardToDifferentColumn(@Body() movingCard: MovingCardType) {
    return this.boardService.moveCardToDifferentColumn(movingCard);
  }
}
